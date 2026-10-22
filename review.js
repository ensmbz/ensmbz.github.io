const reviewConfig = window.SUPABASE_CONFIG || {};
const reviewClient = window.supabase?.createClient(reviewConfig.url || "", reviewConfig.publishableKey || "");
const loginSection = document.querySelector("#reviewLogin");
const queueSection = document.querySelector("#reviewQueue");
const authMessage = document.querySelector("#reviewAuthMessage");
const queueMessage = document.querySelector("#reviewQueueMessage");
const queueItems = document.querySelector("#reviewItems");

function showMessage(target, message, bad = false) {
  target.textContent = message;
  target.classList.toggle("is-error", bad);
}

async function checkOwnerAndLoad() {
  const { data: { session } } = await reviewClient.auth.getSession();
  loginSection.hidden = !!session;
  queueSection.hidden = !session;
  if (!session) return;
  await loadQueue();
}

async function loadQueue() {
  queueItems.replaceChildren();
  showMessage(queueMessage, "LOADING SUBMISSIONS…");
  const { data, error } = await reviewClient.from("photo_submissions")
    .select("id,name,description,image_url,media_type,created_at")
    .eq("approved", false).eq("status", "pending").order("created_at", { ascending: true });
  if (error) {
    showMessage(queueMessage, "This account is not on the photo-owner list, or the queue could not load.", true);
    return;
  }
  showMessage(queueMessage, data.length ? `${data.length} SUBMISSION${data.length === 1 ? "" : "S"} WAITING` : "NO SUBMISSIONS WAITING.");
  for (const item of data) queueItems.append(makeReviewCard(item));
}

function makeReviewCard(item) {
  const card = document.createElement("article");
  card.className = "review-item";
  const media = document.createElement(item.media_type === "video" ? "video" : "img");
  media.className = "review-media"; media.src = item.image_url;
  if (item.media_type === "video") { media.controls = true; media.playsInline = true; }
  else media.alt = `Submission from ${item.name}`;
  const title = document.createElement("h3"); title.textContent = `FROM ${item.name}`;
  const description = document.createElement("p"); description.textContent = item.description || "No description.";
  const date = document.createElement("p"); date.textContent = new Date(item.created_at).toLocaleString();
  const actions = document.createElement("div"); actions.className = "review-actions";
  const approve = document.createElement("button"); approve.className = "review-approve"; approve.textContent = "APPROVE";
  const reject = document.createElement("button"); reject.className = "review-reject"; reject.textContent = "DECLINE";
  approve.addEventListener("click", () => moderate(item.id, true, actions));
  reject.addEventListener("click", () => moderate(item.id, false, actions));
  actions.append(approve, reject); card.append(media, title, description, date, actions);
  return card;
}

async function moderate(id, approve, actions) {
  actions.querySelectorAll("button").forEach((button) => button.disabled = true);
  const { error } = await reviewClient.from("photo_submissions").update({ approved: approve, status: approve ? "approved" : "rejected" }).eq("id", id);
  if (error) {
    actions.querySelectorAll("button").forEach((button) => button.disabled = false);
    showMessage(queueMessage, "Could not save decision. Try again.", true);
    return;
  }
  await loadQueue();
}

document.querySelector("#reviewLoginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.querySelector("#reviewEmail").value.trim();
  const button = event.currentTarget.querySelector("button");
  button.disabled = true; showMessage(authMessage, "SENDING SIGN-IN LINK…");
  const { error } = await reviewClient.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/review.html` } });
  button.disabled = false;
  showMessage(authMessage, error ? "Could not send link. Check email and try again." : "CHECK YOUR EMAIL FOR THE PRIVATE SIGN-IN LINK.", !!error);
});

document.querySelector("#reviewRefresh").addEventListener("click", loadQueue);
document.querySelector("#reviewSignOut").addEventListener("click", async () => { await reviewClient.auth.signOut(); await checkOwnerAndLoad(); });
reviewClient.auth.onAuthStateChange(() => { setTimeout(checkOwnerAndLoad, 0); });
checkOwnerAndLoad();
