const reviewConfig = window.SUPABASE_CONFIG || {};
const reviewClient = window.supabase?.createClient(reviewConfig.url || "", reviewConfig.publishableKey || "");
const loginSection = document.querySelector("#reviewLogin");
const queueSection = document.querySelector("#reviewQueue");
const authMessage = document.querySelector("#reviewAuthMessage");
const queueMessage = document.querySelector("#reviewQueueMessage");
const queueItems = document.querySelector("#reviewItems");
let activeSection = "photos";

function showMessage(target, message, bad = false) {
  target.textContent = message;
  target.classList.toggle("is-error", bad);
}

async function checkOwnerAndLoad() {
  const { data: { session } } = await reviewClient.auth.getSession();
  loginSection.hidden = !!session;
  queueSection.hidden = !session;
  if (session) await loadSection(activeSection);
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
  return loadTakedowns();
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
  if (!email || password.length < 8) return showMessage(authMessage, "Enter your owner email and a password with 8+ characters.", true);
  const button = event.currentTarget;
  button.disabled = true; showMessage(authMessage, "CREATING OWNER LOGIN…");
  const { data, error } = await reviewClient.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/review.html` } });
  button.disabled = false;
  if (error) return showMessage(authMessage, "Could not create login. Try signing in or check your email.", true);
  if (data.session) {
    showMessage(authMessage, "OWNER LOGIN CREATED.");
    await checkOwnerAndLoad();
  } else {
    showMessage(authMessage, "CHECK EMAIL TO CONFIRM. THEN SIGN IN WITH YOUR PASSWORD.");
  }
});

document.querySelector("#reviewRefresh").addEventListener("click", () => loadSection());
document.querySelector("#reviewSignOut").addEventListener("click", async () => { await reviewClient.auth.signOut(); await checkOwnerAndLoad(); });
reviewClient.auth.onAuthStateChange(() => { setTimeout(checkOwnerAndLoad, 0); });
checkOwnerAndLoad();
