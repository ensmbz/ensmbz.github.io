const basePhotos = [
  { id: "base-0823", src: "assets/IMG_0823.PNG", title: "Zayed vs. lunch", caption: "The rice has more brain cells. Probably.", tag: "RICE INCIDENT" },
  { id: "base-0822", src: "assets/IMG_0822.PNG", title: "The thinking close-up", caption: "Searching for the last brain cell…", tag: "LOADING..." },
  { id: "base-0821", src: "assets/IMG_0821.PNG", title: "Backseat philosopher", caption: "Has thoughts. We assume.", tag: "ROAD EDITION" }
];
const grid = document.querySelector("#photoGrid");
const input = document.querySelector("#photoInput");
const count = document.querySelector("#photoCount");
const section = document.querySelector(".gallery-section");
const dialog = document.querySelector("#photoDialog");
const supabaseSettings = window.SUPABASE_CONFIG || {};
const supabaseReady = Boolean(supabaseSettings.url && supabaseSettings.publishableKey && window.supabase);
const supabaseClient = supabaseReady
  ? window.supabase.createClient(supabaseSettings.url, supabaseSettings.publishableKey)
  : null;
let sharedPhotos = [];
const dbPromise = new Promise((resolve) => {
  if (!("indexedDB" in window)) return resolve(null);
  const request = indexedDB.open("max-files-gallery", 1);
  request.onupgradeneeded = () => request.result.createObjectStore("photos", { keyPath: "id" });
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => resolve(null);
});
let addedPhotos = [];

async function readPhotos() {
  const db = await dbPromise;
  if (!db) return [];
  return new Promise((resolve) => {
    const request = db.transaction("photos", "readonly").objectStore("photos").getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => resolve([]);
  });
}
async function savePhoto(photo) {
  const db = await dbPromise;
  if (!db) throw new Error("Photo storage is unavailable in this browser.");
  return new Promise((resolve, reject) => {
    const request = db.transaction("photos", "readwrite").objectStore("photos").put(photo);
    request.onsuccess = resolve;
    request.onerror = () => reject(request.error);
  });
}
async function deletePhoto(id) {
  const db = await dbPromise;
  if (!db) return;
  return new Promise((resolve) => {
    const request = db.transaction("photos", "readwrite").objectStore("photos").delete(id);
    request.onsuccess = resolve;
    request.onerror = resolve;
  });
}
function render() {
  grid.replaceChildren();
  const photos = [...basePhotos, ...sharedPhotos, ...addedPhotos];
  count.textContent = `${String(photos.length).padStart(2, "0")} OBJECT${photos.length === 1 ? "" : "S"}`;
  if (!photos.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "THE GALLERY IS TAKING A NAP. ADD A PHOTO TO WAKE IT UP.";
    grid.append(empty);
    return;
  }
  photos.forEach((photo, index) => {
    const card = document.createElement("article");
    card.className = "photo-card";
    const imageButton = document.createElement("button");
    imageButton.className = "photo-image";
    imageButton.type = "button";
    imageButton.setAttribute("aria-label", `Expand ${photo.title}`);
    const image = document.createElement("img");
    image.src = photo.src || URL.createObjectURL(photo.blob);
    image.alt = photo.title;
    image.loading = index < 3 ? "eager" : "lazy";
    imageButton.append(image);
    const number = document.createElement("span");
    number.className = "photo-index";
    number.textContent = `NO. ${String(index + 1).padStart(3, "0")}`;
    imageButton.append(number);
    imageButton.addEventListener("click", () => {
      document.querySelector("#dialogImage").src = image.src;
      document.querySelector("#dialogImage").alt = photo.title;
      document.querySelector("#dialogCaption").textContent = `${photo.title} — ${photo.caption}`;
      dialog.showModal();
    });
    card.append(imageButton);
    if (photo.local) {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove-photo";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `Remove ${photo.title}`);
      remove.addEventListener("click", async () => {
        await deletePhoto(photo.id);
        addedPhotos = addedPhotos.filter((item) => item.id !== photo.id);
        render();
      });
      card.append(remove);
    }
    const info = document.createElement("div");
    info.className = "photo-info";
    const text = document.createElement("div");
    const title = document.createElement("div");
    title.className = "photo-title";
    title.textContent = photo.title;
    const caption = document.createElement("div");
    caption.className = "photo-caption";
    caption.textContent = photo.uploader ? `${photo.caption} Added by ${photo.uploader}.` : photo.caption;
    text.append(title, caption);
    const tag = document.createElement("span");
    tag.className = "photo-tag";
    tag.textContent = photo.tag || "NEW ARRIVAL";
    info.append(text, tag);
    card.append(info);
    grid.append(card);
  });
}

const contributeDialog = document.querySelector("#contributeDialog");
const contributeForm = document.querySelector("#contributeForm");
const storageNote = document.querySelector("#storageNote");
if (supabaseReady && supabaseClient) {
  storageNote.textContent = "Photos are submitted to the shared gallery and appear after Zayed approves them.";
} else {
  storageNote.textContent = "Shared uploads are not connected yet. Photos you add are saved in this browser on this device.";
}
document.querySelector("#addPhotos").addEventListener("click", () => contributeDialog.showModal());
document.querySelector("#contributeClose").addEventListener("click", () => contributeDialog.close());
contributeDialog.addEventListener("click", (event) => { if (event.target === contributeDialog) contributeDialog.close(); });
contributeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const uploader = document.querySelector("#submitterName").value.trim();
  const files = [...input.files].filter((file) => file.type.startsWith("image/") || /\.(avif|bmp|gif|heic|heif|jpe?g|png|svg|tiff?|webp)$/i.test(file.name));
  const error = document.querySelector("#formError");
  if (!uploader) { error.textContent = "Please enter your name before submitting."; return; }
  if (!files.length) { error.textContent = "Please choose at least one image."; return; }
  if (files.some((file) => file.size > 5 * 1024 * 1024)) { error.textContent = "Each photo must be smaller than 5 MB."; return; }
  error.textContent = "";
  try {
    for (const file of files) {
      const title = file.name.replace(/\.[^.]+$/, "") || "A new masterpiece";
      if (supabaseReady && supabaseClient) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${crypto.randomUUID()}-${safeName}`;
        const { error: uploadError } = await supabaseClient.storage.from("zayed-photos").upload(path, file, { upsert: false, contentType: file.type || "image/jpeg" });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabaseClient.storage.from("zayed-photos").getPublicUrl(path);
        const { error: insertError } = await supabaseClient.from("photo_submissions").insert({ name: uploader, image_url: urlData.publicUrl, approved: false });
        if (insertError) throw insertError;
      } else {
        const photo = { id: crypto.randomUUID(), blob: file, title, caption: "Freshly added to the collection.", tag: "NEW ARRIVAL", uploader, local: true };
        await savePhoto(photo);
        addedPhotos.push(photo);
      }
    }
    contributeForm.reset();
    contributeDialog.close();
    if (supabaseReady) {
      storageNote.textContent = "Photo submitted! It will join the shared gallery after approval.";
    }
    render();
  } catch (uploadError) {
    error.textContent = supabaseReady
      ? `Upload failed: ${uploadError.message || "check the Supabase bucket and policies, then try again."}`
      : "This browser couldn't save the photo. Try a smaller image or another browser.";
  }
});
for (const eventName of ["dragenter", "dragover"]) section.addEventListener(eventName, (event) => { event.preventDefault(); section.classList.add("dragging"); });
for (const eventName of ["dragleave", "drop"]) section.addEventListener(eventName, (event) => { event.preventDefault(); if (eventName === "drop") { input.files = event.dataTransfer.files; input.dispatchEvent(new Event("change")); } section.classList.remove("dragging"); });
document.querySelector("#dialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

const quips = [
  "THE CURATOR WOULD LIKE YOU TO KNOW: ZAYED IS A CERTIFIED GOOFBALL.",
  "BREAKING: ZAYED HAS LOST AN ARGUMENT TO A DOOR THAT SAYS PUSH.",
  "EXPERTS AGREE: ZAYED'S LAST BRAIN CELL IS WORKING OVERTIME.",
  "THIS JUST IN: ZAYED HAS BEEN CONFUSED BY A SPOON AGAIN.",
  "PLEASE KEEP HANDS INSIDE THE INTERNET. ZAYED IS DRIVING.",
  "ZAYED IS PROOF THAT CONFIDENCE AND CLUELESSNESS CAN COEXIST."
];
let previousQuip = 0;
document.querySelector("#quipButton").addEventListener("click", () => {
  let next = Math.floor(Math.random() * quips.length);
  if (next === previousQuip) next = (next + 1) % quips.length;
  previousQuip = next;
  document.querySelector("#quip").textContent = quips[next];
});

// Autoplay the supplied sound effect and keep it looping. If the browser
// blocks audible autoplay, retry on the visitor's first page interaction.
const loopAudio = document.querySelector("#loopAudio");
loopAudio.volume = 0.45;
async function startAudio() {
  try {
    await loopAudio.play();
    document.querySelector(".music-art").classList.add("playing");
  } catch { /* Browser autoplay policy may require a visitor interaction. */ }
}
startAudio();
document.addEventListener("pointerdown", () => { if (loopAudio.paused) startAudio(); }, { once: true });
document.addEventListener("keydown", () => { if (loopAudio.paused) startAudio(); }, { once: true });

async function loadSharedPhotos() {
  if (!supabaseReady || !supabaseClient) return;
  const { data, error } = await supabaseClient.from("photo_submissions")
    .select("id,name,image_url,created_at")
    .eq("approved", true)
    .order("created_at", { ascending: false });
  if (error) {
    storageNote.textContent = "The shared gallery could not load. Check the Supabase table and access policies.";
    return;
  }
  sharedPhotos = (data || []).map((row) => ({
    id: `shared-${row.id}`, src: row.image_url, title: "A community masterpiece",
    caption: "Freshly added to the collection.", tag: "COMMUNITY", uploader: row.name
  }));
  render();
}

Promise.all([readPhotos(), loadSharedPhotos()]).then(([photos]) => {
  addedPhotos = photos.map((photo) => ({ ...photo, local: true }));
  render();
});
