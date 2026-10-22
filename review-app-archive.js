const reviewConfig = window.SUPABASE_CONFIG || {};
const reviewClient = window.supabase?.createClient(reviewConfig.url || "", reviewConfig.publishableKey || "");
const loginSection = document.querySelector("#reviewLogin");
const queueSection = document.querySelector("#reviewQueue");
const authMessage = document.querySelector("#reviewAuthMessage");
const queueMessage = document.querySelector("#reviewQueueMessage");
const queueItems = document.querySelector("#reviewItems");
let activeSection = "photos";
let currentAccess = null;
let panicApprovalHandled = false;
const sectionPermissions = {
  photos: "review_photos", archive: "manage_takedowns", comments: "manage_comments", reports: "manage_reports",
  takedowns: "manage_takedowns", chat: "manage_chat", site: "manage_site", staff: "owner"
};
const permissionLabels = {
  review_photos: "Approve photos", manage_comments: "Moderate comments",
  manage_reports: "Resolve reports", manage_takedowns: "Handle takedowns",
  manage_chat: "Manage chat", manage_site: "Pause or open site"
};
const staffLoginDomain = "staff.ensmbz.local";

function staffLoginEmail(username) {
  return `${username.trim().toLowerCase()}@${staffLoginDomain}`;
}

function showMessage(target, message, bad = false) {
  target.textContent = message;
  target.classList.toggle("is-error", bad);
}

async function checkOwnerAndLoad() {
  const { data: { session } } = await reviewClient.auth.getSession();
  if (!session) {
    currentAccess = null;
    loginSection.hidden = false;
    queueSection.hidden = true;
    return;
  }
  const email = session.user.email?.toLowerCase() || "";
  const [{ data: isOwner }, { data: staff }] = await Promise.all([
    reviewClient.rpc("is_site_owner"),
    reviewClient.from("staff_permissions").select("*").eq("email", email).maybeSingle()
  ]);
  if (!isOwner && !staff) {
    await reviewClient.auth.signOut();
    showMessage(authMessage, "This account has no staff access yet. Ask the owner to create your staff username in Staff Desk.", true);
    return;
  }
  currentAccess = isOwner
    ? { email, owner: true, ...Object.fromEntries(Object.keys(permissionLabels).map((key) => [key, true])) }
    : { ...staff, owner: false };
  document.querySelectorAll(".review-tab").forEach((tab) => {
    const permission = sectionPermissions[tab.dataset.section];
    tab.hidden = permission === "owner" ? !currentAccess.owner : !currentAccess[permission];
  });
  const available = Object.keys(sectionPermissions).filter((section) => {
    const permission = sectionPermissions[section];
    return permission === "owner" ? currentAccess.owner : currentAccess[permission];
  });
  if (!available.length) {
    loginSection.hidden = true;
    queueSection.hidden = false;
    queueItems.replaceChildren();
    showMessage(queueMessage, "NO CONTROLS HAVE BEEN ASSIGNED TO THIS ACCOUNT YET.", true);
    return;
  }
  if (!available.includes(activeSection)) activeSection = available[0];
  loginSection.hidden = true;
  queueSection.hidden = false;
  await loadSection(activeSection);
  await handlePanicEmailApproval(session);
}

async function loadSection(section = activeSection) {
  activeSection = section;
  document.querySelectorAll(".review-tab").forEach((tab) => {
    const selected = tab.dataset.section === section;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });
  queueItems.replaceChildren();
  showMessage(queueMessage, "LOADING…");
  if (section === "photos") return loadPhotos();
  if (section === "archive") return loadArchive();
  if (section === "comments") return loadComments();
  if (section === "reports") return loadReports();
  if (section === "takedowns") return loadTakedowns();
  if (section === "chat") return loadChat();
  if (section === "site") return loadSite();
  return loadStaff();
}

function loadRows(table, select, filters = []) {
  let query = reviewClient.from(table).select(select).order("created_at", { ascending: true });
  for (const [column, value] of filters) query = query.eq(column, value);
  return query;
}

async function loadPhotos() {
  const { data, error } = await loadRows("photo_submissions", "id,name,description,image_url,media_type,created_at")
    .eq("approved", false).eq("status", "pending");
  if (error) return failQueue("Could not load photos. Check owner access and setup SQL.");
  const uniquePhotos = [...new Map(data.map((item) => [`${item.image_url}|${item.name}|${item.description || ""}`, item])).values()];
  showMessage(queueMessage, countLabel(uniquePhotos.length, "PHOTO", "PHOTOS"));
  uniquePhotos.forEach((item) => queueItems.append(makePhotoCard(item)));
}

async function loadArchive() {
  const { data, error } = await loadRows("photo_submissions", "id,name,description,image_url,media_type,created_at")
    .eq("approved", true).eq("status", "approved");
  if (error) return failQueue("Could not load the photo archive.");
  showMessage(queueMessage, countLabel(data.length, "ARCHIVED POST", "ARCHIVED POSTS"));
  data.forEach((item) => queueItems.append(makeArchiveCard(item)));
}

async function loadComments() {
  const { data, error } = await loadRows("photo_comments", "id,photo_id,name,body,status,created_at", [["status", "visible"]]);
  if (error) return failQueue("Could not load comments. Run the owner inbox SQL first.");
  showMessage(queueMessage, countLabel(data.length, "COMMENT", "COMMENTS"));
  data.forEach((item) => queueItems.append(makeTextCard("COMMENT", `POST #${item.photo_id} · ${item.name}`, item.body, item.created_at, [
    actionButton("HIDE COMMENT", "review-reject", () => updateRow("photo_comments", item.id, { status: "removed" }))
  ])));
}

async function loadReports() {
  const { data, error } = await loadRows("site_reports", "id,name,body,status,created_at", [["status", "open"]]);
  if (error) return failQueue("Could not load reports. Run the owner inbox SQL first.");
  showMessage(queueMessage, countLabel(data.length, "OPEN REPORT", "OPEN REPORTS"));
  data.forEach((item) => queueItems.append(makeTextCard("REPORT", item.name || "Anonymous", item.body, item.created_at, [
    actionButton("MARK RESOLVED", "review-approve", () => updateRow("site_reports", item.id, { status: "resolved" }))
  ])));
}

async function loadTakedowns() {
  const { data, error } = await loadRows("photo_takedown_requests", "id,photo_id,name,reason,status,created_at", [["status", "pending"]]);
  if (error) return failQueue("Could not load takedown requests. Run the owner inbox SQL first.");
  showMessage(queueMessage, countLabel(data.length, "TAKEDOWN REQUEST", "TAKEDOWN REQUESTS"));
  data.forEach((item) => queueItems.append(makeTextCard("TAKEDOWN", `POST #${item.photo_id} · ${item.name}`, item.reason, item.created_at, [
    actionButton("TAKE DOWN FROM GALLERY", "review-reject", () => takeDown(item)),
    actionButton("KEEP · RESOLVE", "review-approve", () => updateRow("photo_takedown_requests", item.id, { status: "resolved" }))
  ])));
}

async function loadChat() {
  const { data, error } = await loadRows("chat_messages", "id,name,body,created_at");
  if (error) return failQueue("Could not load the chat room.");
  showMessage(queueMessage, countLabel(data.length, "MESSAGE", "MESSAGES"));
  if (data.length) {
    const toolbar = document.createElement("div");
    toolbar.className = "desk-toolbar";
    const clear = actionButton("CLEAR ALL CHAT", "review-danger", clearChat);
    toolbar.append(clear);
    queueItems.append(toolbar);
  }
  data.forEach((item) => queueItems.append(makeTextCard("CHAT MESSAGE", item.name, item.body, item.created_at, [
    actionButton("DELETE MESSAGE", "review-reject", () => deleteRow("chat_messages", item.id))
  ])));
}

async function loadSite() {
  const { data, error } = await reviewClient.from("site_control").select("id,is_live,panic_mode,updated_at").eq("id", true).single();
  if (error) return failQueue("Could not load the site controls.");
  const mode = data.panic_mode ? "PANIC" : data.is_live ? "OPEN" : "PAUSED";
  showMessage(queueMessage, `THE MUSEUM IS IN ${mode} MODE`);
  const card = document.createElement("article");
  card.className = "review-item site-control-card";
  const label = document.createElement("p"); label.className = "review-label"; label.textContent = "LIVE STATUS";
  const title = document.createElement("h3"); title.textContent = `SITE ${mode}`;
  const body = document.createElement("p"); body.className = "review-body"; body.textContent = mode === "OPEN"
    ? "Visitors can use the full museum."
    : mode === "PAUSED" ? "Visitors see the Taking a Break screen." : "Visitors see a normal 404 page.";
  const setMode = async (nextMode) => {
    const buttons = card.querySelectorAll("button"); buttons.forEach((button) => { button.disabled = true; });
    const { error: updateError } = await reviewClient.from("site_control").update({ is_live: nextMode === "open", panic_mode: nextMode === "panic", updated_at: new Date().toISOString() }).eq("id", true);
    if (updateError) return failQueue("Could not change the site status.");
    await loadSite();
  };
  const open = actionButton("OPEN SITE", "review-approve", () => setMode("open"));
  const pause = actionButton("PAUSE SITE", "review-pause", () => setMode("paused"));
  const panic = actionButton("EMAIL PANIC APPROVAL", "review-danger", async () => {
    panic.disabled = true;
    const { data: { session } } = await reviewClient.auth.getSession();
    if (!session?.user?.email) { panic.disabled = false; return failQueue("Owner sign-in is required before sending a panic approval email."); }
    const redirectTo = "https://ensmbz.github.io/review.html?approve_panic=1";
    const { error } = await reviewClient.auth.signInWithOtp({ email: session.user.email, options: { shouldCreateUser: false, emailRedirectTo: redirectTo } });
    panic.disabled = false;
    if (error) return failQueue("Could not send the panic approval email.");
    showMessage(queueMessage, `PANIC APPROVAL SENT TO ${session.user.email}. NOTHING HAS BEEN DELETED.`);
  });
  card.append(label, title, body, makeActions([open, pause, panic]));
  if (currentAccess?.owner) {
    const ips = document.createElement("a");
    ips.className = "review-secondary";
    ips.href = "https://100.94.57.126:8090/";
    ips.target = "_blank";
    ips.rel = "noopener";
    ips.textContent = "OPEN PRIVATE IP DESK ↗";
    card.append(ips);
  }
  queueItems.append(card);
}

async function handlePanicEmailApproval(session) {
  if (panicApprovalHandled || !currentAccess?.owner || new URLSearchParams(location.search).get("approve_panic") !== "1") return;
  panicApprovalHandled = true;
  history.replaceState({}, "", "/review.html");
  const typed = prompt("Email approval received. Type DELETE EVERYTHING to permanently delete GitHub and Supabase. The PC backup will remain.");
  if (typed !== "DELETE EVERYTHING") return showMessage(queueMessage, "PANIC CANCELLED. NOTHING WAS DELETED.");
  if (!confirm("Final confirmation: permanently delete the website, database, uploads, owner accounts, and staff access?")) return showMessage(queueMessage, "PANIC CANCELLED. NOTHING WAS DELETED.");
  showMessage(queueMessage, "PANIC DELETION STARTING…");
  try {
    const response = await fetch(`${reviewConfig.url}/functions/v1/site-panic`, {
      method: "POST",
      headers: { apikey: reviewConfig.publishableKey, authorization: `Bearer ${session.access_token}`, "content-type": "application/json" },
      body: JSON.stringify({ confirmation: typed }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) return failQueue(result.error || "Panic deletion failed.");
    showMessage(queueMessage, result.message || "DELETION STARTED.");
  } catch {
    failQueue("Panic deletion could not start.");
  }
}

async function loadStaff() {
  const { data, error } = await reviewClient.from("staff_permissions").select("*").order("created_at", { ascending: true });
  if (error) return failQueue("Could not load staff permissions.");
  showMessage(queueMessage, countLabel(data.length, "STAFF MEMBER", "STAFF MEMBERS"));
  queueItems.append(makeOwnerPasswordCard(), makeStaffEditor());
  data.forEach((staff) => queueItems.append(makeStaffCard(staff)));
}

function makeStaffEditor(staff = null) {
  const form = document.createElement("form");
  form.className = "staff-editor";
  const title = document.createElement("h3"); title.textContent = staff ? "EDIT STAFF ACCESS" : "ADD STAFF MEMBER";
  const note = document.createElement("p"); note.textContent = "Create a staff username and password, then choose what appears on their desk.";
  const username = document.createElement("input"); username.type = "text"; username.required = true; username.autocomplete = "username"; username.pattern = "[A-Za-z0-9_-]{3,32}"; username.placeholder = "Staff username"; username.value = staff?.username || ""; username.readOnly = Boolean(staff);
  const password = document.createElement("input"); password.type = "password"; password.minLength = 8; password.autocomplete = "new-password"; password.placeholder = staff ? "New password (leave blank to keep it)" : "Create their password (8+ characters)"; password.required = !staff;
  const choices = document.createElement("div"); choices.className = "permission-grid";
  Object.entries(permissionLabels).forEach(([key, label]) => {
    const choice = document.createElement("label");
    const checkbox = document.createElement("input"); checkbox.type = "checkbox"; checkbox.name = key; checkbox.checked = Boolean(staff?.[key]);
    const copy = document.createElement("span"); copy.textContent = label;
    choice.append(checkbox, copy); choices.append(choice);
  });
  const save = document.createElement("button"); save.type = "submit"; save.className = "review-primary"; save.textContent = staff ? "SAVE ACCESS" : "ADD TO STAFF";
  form.append(title, note, username, password, choices, save);
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); save.disabled = true;
    const permissions = {};
    Object.keys(permissionLabels).forEach((key) => { permissions[key] = form.elements[key].checked; });
    const { data: { session } } = await reviewClient.auth.getSession();
    const response = await fetch(`${reviewConfig.url}/functions/v1/manage-staff`, {
      method: "POST", headers: { apikey: reviewConfig.publishableKey, authorization: `Bearer ${session.access_token}`, "content-type": "application/json" },
      body: JSON.stringify({ username: username.value.trim().toLowerCase(), password: password.value, permissions }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) { save.disabled = false; return failQueue(result.error || "Could not save this staff member."); }
    await loadStaff();
  });
  return form;
}

function makeStaffCard(staff) {
  const card = document.createElement("article"); card.className = "review-item staff-card";
  const label = document.createElement("p"); label.className = "review-label"; label.textContent = "STAFF ACCESS";
  const title = document.createElement("h3"); title.textContent = `@${staff.username}`;
  const permissions = document.createElement("p"); permissions.className = "review-body";
  const enabled = Object.entries(permissionLabels).filter(([key]) => staff[key]).map(([, value]) => value);
  permissions.textContent = enabled.length ? enabled.join(" · ") : "No permissions assigned";
  const edit = actionButton("CHANGE ACCESS", "review-approve", () => {
    card.replaceWith(makeStaffEditor(staff));
  });
  const remove = actionButton("REMOVE STAFF", "review-reject", async () => {
    if (!confirm(`Delete the staff login and all access for @${staff.username}?`)) return;
    const { data: { session } } = await reviewClient.auth.getSession();
    const response = await fetch(`${reviewConfig.url}/functions/v1/manage-staff`, {
      method: "POST", headers: { apikey: reviewConfig.publishableKey, authorization: `Bearer ${session.access_token}`, "content-type": "application/json" },
      body: JSON.stringify({ action: "remove", username: staff.username }),
    });
    if (!response.ok) return failQueue("Could not remove this staff member.");
    await loadStaff();
  });
  card.append(label, title, permissions, makeActions([edit, remove]));
  return card;
}

function makeOwnerPasswordCard() {
  const form = document.createElement("form"); form.className = "staff-editor owner-password-card";
  const title = document.createElement("h3"); title.textContent = "OWNER PASSWORD";
  const note = document.createElement("p"); note.textContent = "Change the password for your signed-in owner account.";
  const password = document.createElement("input"); password.type = "password"; password.minLength = 8; password.required = true; password.autocomplete = "new-password"; password.placeholder = "New owner password (8+ characters)";
  const save = document.createElement("button"); save.type = "submit"; save.className = "review-primary"; save.textContent = "CHANGE OWNER PASSWORD";
  form.append(title, note, password, save);
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); save.disabled = true;
    const { error } = await reviewClient.auth.updateUser({ password: password.value });
    save.disabled = false;
    if (error) return failQueue("Could not change the owner password.");
    password.value = ""; showMessage(queueMessage, "OWNER PASSWORD CHANGED.");
  });
  return form;
}

function countLabel(count, singular, plural) {
  return `${count} ${count === 1 ? singular : plural} WAITING`;
}

function failQueue(message) { showMessage(queueMessage, message, true); }

function makePhotoCard(item) {
  const card = document.createElement("article");
  card.className = "review-item";
  const media = document.createElement(item.media_type === "video" ? "video" : "img");
  media.className = "review-media";
  media.src = item.image_url;
  if (item.media_type === "video") { media.controls = true; media.playsInline = true; }
  else media.alt = `Submission from ${item.name}`;
  const title = document.createElement("h3"); title.textContent = `FROM ${item.name}`;
  const description = document.createElement("p"); description.textContent = item.description || "No description.";
  const date = makeDate(item.created_at);
  const actions = makeActions([
    actionButton("APPROVE", "review-approve", () => moderate(item, true, actions)),
    actionButton("DECLINE", "review-reject", () => moderate(item, false, actions))
  ]);
  card.append(media, title, description, date, actions);
  return card;
}

function makeArchiveCard(item) {
  const card = document.createElement("article");
  card.className = "review-item";
  const media = document.createElement(item.media_type === "video" ? "video" : "img");
  media.className = "review-media";
  media.src = item.image_url;
  if (item.media_type === "video") { media.controls = true; media.playsInline = true; }
  else media.alt = `Archived post from ${item.name}`;
  const title = document.createElement("h3"); title.textContent = `FROM ${item.name}`;
  const description = document.createElement("p"); description.textContent = item.description || "No description.";
  const remove = actionButton("DELETE PHOTO", "review-reject", () => deleteArchivedMedia(item, card));
  card.append(media, title, description, makeDate(item.created_at), makeActions([remove]));
  return card;
}

async function deleteArchivedMedia(item, card) {
  if (!confirm(`Permanently delete this post from ${item.name}?`)) return;
  const button = card.querySelector("button");
  button.disabled = true;
  const { data: { session } } = await reviewClient.auth.getSession();
  const response = await fetch(`${reviewConfig.url}/functions/v1/delete-media`, {
    method: "POST",
    headers: { apikey: reviewConfig.publishableKey, authorization: `Bearer ${session.access_token}`, "content-type": "application/json" },
    body: JSON.stringify({ id: item.id }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) { button.disabled = false; return failQueue(result.error || "Could not delete this photo."); }
  await loadArchive();
}

function makeTextCard(label, titleText, bodyText, dateValue, buttons) {
  const card = document.createElement("article");
  card.className = "review-item review-note";
  const labelNode = document.createElement("p"); labelNode.className = "review-label"; labelNode.textContent = label;
  const title = document.createElement("h3"); title.textContent = titleText;
  const body = document.createElement("p"); body.className = "review-body"; body.textContent = bodyText;
  card.append(labelNode, title, body, makeDate(dateValue), makeActions(buttons));
  return card;
}

function makeDate(value) {
  const date = document.createElement("p");
  date.className = "review-date";
  date.textContent = new Date(value).toLocaleString();
  return date;
}

function actionButton(label, className, action) {
  const button = document.createElement("button");
  button.type = "button"; button.className = className; button.textContent = label;
  button.addEventListener("click", action);
  return button;
}

function makeActions(buttons) {
  const actions = document.createElement("div");
  actions.className = "review-actions";
  buttons.forEach((button) => actions.append(button));
  return actions;
}

async function moderate(item, approve, actions) {
  setBusy(actions, true);
  const { error } = await reviewClient.rpc("moderate_photo", { photo_id: item.id, approve, photo_url: item.image_url, photo_name: item.name });
  if (error) { setBusy(actions, false); return failQueue(error.message || "Could not save decision. Try again."); }
  await loadSection();
}

async function updateRow(table, id, changes) {
  const actions = queueItems.querySelectorAll(".review-actions button");
  actions.forEach((button) => button.disabled = true);
  const { error } = await reviewClient.from(table).update(changes).eq("id", id);
  if (error) {
    actions.forEach((button) => button.disabled = false);
    return failQueue("Could not save decision. Check owner inbox SQL and try again.");
  }
  await loadSection();
}

async function deleteRow(table, id) {
  const { error } = await reviewClient.from(table).delete().eq("id", id);
  if (error) return failQueue("Could not delete that item.");
  await loadSection();
}

async function clearChat() {
  if (!confirm("Delete every message in the public chat room?")) return;
  const { error } = await reviewClient.from("chat_messages").delete().gt("id", 0);
  if (error) return failQueue("Could not clear the chat room.");
  await loadChat();
}

async function takeDown(item) {
  const actions = queueItems.querySelectorAll(".review-actions button");
  actions.forEach((button) => button.disabled = true);
  const { error: photoError } = await reviewClient.from("photo_submissions")
    .update({ approved: false, status: "rejected" }).eq("id", item.photo_id).eq("approved", true);
  if (photoError) {
    actions.forEach((button) => button.disabled = false);
    return failQueue("Could not remove post from the public gallery. Check owner inbox SQL.");
  }
  const { error: requestError } = await reviewClient.from("photo_takedown_requests")
    .update({ status: "resolved" }).eq("id", item.id);
  if (requestError) return failQueue("Post is off the gallery, but the request did not resolve. Refresh and resolve it.");
  await loadSection();
}

function setBusy(actions, busy) { actions.querySelectorAll("button").forEach((button) => button.disabled = busy); }

document.querySelectorAll(".review-tab").forEach((tab) => tab.addEventListener("click", () => loadSection(tab.dataset.section)));
document.querySelector("#reviewLoginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const usernameOrEmail = document.querySelector("#reviewUsername").value.trim().toLowerCase();
  const email = usernameOrEmail.includes("@") ? usernameOrEmail : staffLoginEmail(usernameOrEmail);
  const password = document.querySelector("#reviewPassword").value;
  const button = event.currentTarget.querySelector("button");
  button.disabled = true; showMessage(authMessage, "SIGNING IN…");
  const { error } = await reviewClient.auth.signInWithPassword({ email, password });
  button.disabled = false;
  if (error) return showMessage(authMessage, "Sign-in failed. Check username and password.", true);
  showMessage(authMessage, "SIGNED IN.");
  await checkOwnerAndLoad();
});

document.querySelector("#reviewResetPassword").addEventListener("click", async (event) => {
  const email = document.querySelector("#reviewUsername").value.trim().toLowerCase();
  if (!email.includes("@")) return showMessage(authMessage, "Only the owner can reset a password by email. Ask the owner to change a staff password.", true);
  const button = event.currentTarget;
  button.disabled = true; showMessage(authMessage, "SENDING PASSWORD RESET…");
  const { error } = await reviewClient.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/review.html` });
  button.disabled = false;
  if (error) return showMessage(authMessage, "Could not send the reset email.", true);
  showMessage(authMessage, "CHECK YOUR EMAIL FOR THE PASSWORD RESET LINK.");
});

document.querySelector("#reviewRefresh").addEventListener("click", () => loadSection());
document.querySelector("#reviewSignOut").addEventListener("click", async () => { await reviewClient.auth.signOut(); await checkOwnerAndLoad(); });
reviewClient.auth.onAuthStateChange(() => { setTimeout(checkOwnerAndLoad, 0); });
checkOwnerAndLoad();
