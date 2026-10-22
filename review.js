const reviewConfig = window.SUPABASE_CONFIG || {};
const reviewClient = window.supabase?.createClient(reviewConfig.url || "", reviewConfig.publishableKey || "");
const loginSection = document.querySelector("#reviewLogin");
const queueSection = document.querySelector("#reviewQueue");
const authMessage = document.querySelector("#reviewAuthMessage");
const queueMessage = document.querySelector("#reviewQueueMessage");
const queueItems = document.querySelector("#reviewItems");
let activeSection = "photos";
let currentAccess = null;
const sectionPermissions = {
  photos: "review_photos", comments: "manage_comments", reports: "manage_reports",
  takedowns: "manage_takedowns", chat: "manage_chat", site: "manage_site", staff: "owner"
};
const permissionLabels = {
  review_photos: "Approve photos", manage_comments: "Moderate comments",
  manage_reports: "Resolve reports", manage_takedowns: "Handle takedowns",
  manage_chat: "Manage chat", manage_site: "Pause or open site"
};

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
    showMessage(authMessage, "This account has no staff access yet. Ask the owner to add this email in Staff Desk.", true);
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
  showMessage(queueMessage, countLabel(data.length, "PHOTO", "PHOTOS"));
  data.forEach((item) => queueItems.append(makePhotoCard(item)));
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
  const { data, error } = await reviewClient.from("site_control").select("id,is_live,updated_at").eq("id", true).single();
  if (error) return failQueue("Could not load the site controls.");
  showMessage(queueMessage, data.is_live ? "THE MUSEUM IS OPEN" : "THE MUSEUM IS PAUSED");
  const card = document.createElement("article");
  card.className = "review-item site-control-card";
  const label = document.createElement("p"); label.className = "review-label"; label.textContent = "LIVE STATUS";
  const title = document.createElement("h3"); title.textContent = data.is_live ? "SITE OPEN" : "SITE PAUSED";
  const body = document.createElement("p"); body.className = "review-body"; body.textContent = data.is_live
    ? "Visitors can use the gallery, comments, and chat room."
    : "Visitors only see the mysterious paused screen.";
  const toggle = actionButton(data.is_live ? "PAUSE SITE" : "OPEN SITE", data.is_live ? "review-reject" : "review-approve", async () => {
    toggle.disabled = true;
    const { error: updateError } = await reviewClient.from("site_control").update({ is_live: !data.is_live, updated_at: new Date().toISOString() }).eq("id", true);
    if (updateError) return failQueue("Could not change the site status.");
    await loadSite();
  });
  card.append(label, title, body, makeActions([toggle]));
  queueItems.append(card);
}

async function loadStaff() {
  const { data, error } = await reviewClient.from("staff_permissions").select("*").order("created_at", { ascending: true });
  if (error) return failQueue("Could not load staff permissions.");
  showMessage(queueMessage, countLabel(data.length, "STAFF MEMBER", "STAFF MEMBERS"));
  queueItems.append(makeStaffEditor());
  data.forEach((staff) => queueItems.append(makeStaffCard(staff)));
}

function makeStaffEditor(staff = null) {
  const form = document.createElement("form");
  form.className = "staff-editor";
  const title = document.createElement("h3"); title.textContent = staff ? "EDIT STAFF ACCESS" : "ADD STAFF MEMBER";
  const note = document.createElement("p"); note.textContent = "Enter their login email, then choose what appears on their desk.";
  const email = document.createElement("input"); email.type = "email"; email.required = true; email.placeholder = "staff@email.com"; email.value = staff?.email || ""; email.readOnly = Boolean(staff);
  const choices = document.createElement("div"); choices.className = "permission-grid";
  Object.entries(permissionLabels).forEach(([key, label]) => {
    const choice = document.createElement("label");
    const checkbox = document.createElement("input"); checkbox.type = "checkbox"; checkbox.name = key; checkbox.checked = Boolean(staff?.[key]);
    const copy = document.createElement("span"); copy.textContent = label;
    choice.append(checkbox, copy); choices.append(choice);
  });
  const save = document.createElement("button"); save.type = "submit"; save.className = "review-primary"; save.textContent = staff ? "SAVE ACCESS" : "ADD TO STAFF";
  form.append(title, note, email, choices, save);
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); save.disabled = true;
    const row = { email: email.value.trim().toLowerCase(), updated_at: new Date().toISOString() };
    Object.keys(permissionLabels).forEach((key) => { row[key] = form.elements[key].checked; });
    const { error } = await reviewClient.from("staff_permissions").upsert(row, { onConflict: "email" });
    if (error) { save.disabled = false; return failQueue("Could not save this staff member."); }
    await loadStaff();
  });
  return form;
}

function makeStaffCard(staff) {
  const card = document.createElement("article"); card.className = "review-item staff-card";
  const label = document.createElement("p"); label.className = "review-label"; label.textContent = "STAFF ACCESS";
  const title = document.createElement("h3"); title.textContent = staff.email;
  const permissions = document.createElement("p"); permissions.className = "review-body";
  const enabled = Object.entries(permissionLabels).filter(([key]) => staff[key]).map(([, value]) => value);
  permissions.textContent = enabled.length ? enabled.join(" · ") : "No permissions assigned";
  const edit = actionButton("CHANGE ACCESS", "review-approve", () => {
    card.replaceWith(makeStaffEditor(staff));
  });
  const remove = actionButton("REMOVE STAFF", "review-reject", async () => {
    if (!confirm(`Remove all access for ${staff.email}?`)) return;
    const { error } = await reviewClient.from("staff_permissions").delete().eq("email", staff.email);
    if (error) return failQueue("Could not remove this staff member.");
    await loadStaff();
  });
  card.append(label, title, permissions, makeActions([edit, remove]));
  return card;
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
    actionButton("APPROVE", "review-approve", () => moderate(item.id, true, actions)),
    actionButton("DECLINE", "review-reject", () => moderate(item.id, false, actions))
  ]);
  card.append(media, title, description, date, actions);
  return card;
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

async function moderate(id, approve, actions) {
  setBusy(actions, true);
  const { error } = await reviewClient.from("photo_submissions")
    .update({ approved: approve, status: approve ? "approved" : "rejected" }).eq("id", id);
  if (error) { setBusy(actions, false); return failQueue("Could not save decision. Try again."); }
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
  const email = document.querySelector("#reviewUsername").value.trim();
  const password = document.querySelector("#reviewPassword").value;
  const button = event.currentTarget.querySelector("button");
  button.disabled = true; showMessage(authMessage, "SIGNING IN…");
  const { error } = await reviewClient.auth.signInWithPassword({ email, password });
  button.disabled = false;
  if (error) return showMessage(authMessage, "Sign-in failed. Check username and password.", true);
  showMessage(authMessage, "SIGNED IN.");
  await checkOwnerAndLoad();
});

document.querySelector("#reviewCreateAccount").addEventListener("click", async (event) => {
  const email = document.querySelector("#reviewUsername").value.trim();
  const password = document.querySelector("#reviewPassword").value;
  if (!email || password.length < 8) return showMessage(authMessage, "Enter your approved staff email and a password with 8+ characters.", true);
  const button = event.currentTarget;
  button.disabled = true; showMessage(authMessage, "CREATING STAFF LOGIN…");
  const { data, error } = await reviewClient.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/review.html` } });
  button.disabled = false;
  if (error) return showMessage(authMessage, "Could not create login. Try signing in or check your email.", true);
  if (data.session) {
    showMessage(authMessage, "STAFF LOGIN CREATED.");
    await checkOwnerAndLoad();
  } else {
    showMessage(authMessage, "CHECK EMAIL TO CONFIRM. THEN SIGN IN WITH YOUR PASSWORD.");
  }
});

document.querySelector("#reviewRefresh").addEventListener("click", () => loadSection());
document.querySelector("#reviewSignOut").addEventListener("click", async () => { await reviewClient.auth.signOut(); await checkOwnerAndLoad(); });
reviewClient.auth.onAuthStateChange(() => { setTimeout(checkOwnerAndLoad, 0); });
checkOwnerAndLoad();
