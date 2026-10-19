const basePhotos = [
  { id: "base-0823", src: "assets/IMG_0823.PNG", title: "ENS MBZ vs. lunch", caption: "The rice has more brain cells. Probably.", tag: "RICE INCIDENT" },
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
let basePhotoHashesPromise;

async function hashPhoto(file) {
  const bytes = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function perceptualHashPhoto(file) {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("This browser cannot check photo duplicates.");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, 32, 32);
    context.drawImage(bitmap, 0, 0, 32, 32);
    const { data } = context.getImageData(0, 0, 32, 32);
    const gray = new Float64Array(32 * 32);
    for (let i = 0; i < gray.length; i++) {
      const p = i * 4;
      gray[i] = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
    }

    const cosine = Array.from({ length: 8 }, (_, frequency) =>
      Float64Array.from({ length: 32 }, (_, position) => Math.cos(((2 * position + 1) * frequency * Math.PI) / 64)));
    const coefficients = new Float64Array(64);
    let index = 0;
    for (let v = 0; v < 8; v++) {
      for (let u = 0; u < 8; u++) {
        let sum = 0;
        for (let y = 0; y < 32; y++) {
          const yWeight = cosine[v][y];
          for (let x = 0; x < 32; x++) sum += gray[y * 32 + x] * cosine[u][x] * yWeight;
        }
        coefficients[index++] = sum;
      }
    }

    const lowFrequencies = [...coefficients.slice(1)].sort((a, b) => a - b);
    const median = lowFrequencies[Math.floor(lowFrequencies.length / 2)];
    let hash = "";
    for (let i = 0; i < coefficients.length; i += 4) {
      let nibble = 0;
      for (let bit = 0; bit < 4; bit++) nibble = (nibble << 1) | (coefficients[i + bit] > median ? 1 : 0);
      hash += nibble.toString(16);
    }
    return hash;
  } finally {
    bitmap.close?.();
  }
}

function perceptualHashesMatch(left, right, threshold = 6) {
  if (!/^[0-9a-f]{16}$/i.test(left || "") || !/^[0-9a-f]{16}$/i.test(right || "")) return false;
  let distance = 0;
  for (let i = 0; i < 16; i++) {
    let bits = Number.parseInt(left[i], 16) ^ Number.parseInt(right[i], 16);
    while (bits) { distance++; bits &= bits - 1; }
    if (distance > threshold) return false;
  }
  return true;
}

async function hasBasePhotoDuplicate(visualHash) {
  if (!basePhotoHashesPromise) {
    basePhotoHashesPromise = Promise.all(basePhotos.map(async (photo) => {
      try {
        const response = await fetch(photo.src);
        if (!response.ok) return null;
        return await perceptualHashPhoto(await response.blob());
      } catch {
        return null;
      }
    }));
  }
  const hashes = await basePhotoHashesPromise;
  return hashes.some((hash) => perceptualHashesMatch(hash, visualHash));
}

function isDuplicatePhotoError(error) {
  return error?.code === "23505" || error?.statusCode === "409" || /already exists|duplicate/i.test(error?.message || "");
}

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
  storageNote.textContent = "Photos are submitted to the shared gallery and appear after ENS MBZ approves them.";
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
    let submitted = 0;
    let duplicates = 0;
    for (const file of files) {
      const title = file.name.replace(/\.[^.]+$/, "") || "A new masterpiece";
      const contentHash = await hashPhoto(file);
      const visualHash = await perceptualHashPhoto(file);
      if (await hasBasePhotoDuplicate(visualHash)) { duplicates++; continue; }
      if (supabaseReady && supabaseClient) {
        const { data: isDuplicate, error: duplicateCheckError } = await supabaseClient.rpc("is_duplicate_photo", {
          candidate_hash: visualHash,
          candidate_content_hash: contentHash,
          max_distance: 6,
        });
        if (duplicateCheckError) throw new Error("Duplicate checking is not set up yet. Please tell the site owner to apply the Supabase photo-deduplication migration.");
        if (isDuplicate) { duplicates++; continue; }

        // Keep the exact-content path for compatibility and let Supabase also
        // compare visual hashes to catch resized or recompressed copies.
        const extension = file.name.match(/\.[a-zA-Z0-9]{1,10}$/)?.[0]?.toLowerCase() || ".jpg";
        const path = `photos/${contentHash}${extension}`;
        const { error: uploadError } = await supabaseClient.storage.from("zayed-photos").upload(path, file, { upsert: false, contentType: file.type || "image/jpeg" });
        if (uploadError) {
          if (isDuplicatePhotoError(uploadError)) { duplicates++; continue; }
          throw uploadError;
        }
        const { data: urlData } = supabaseClient.storage.from("zayed-photos").getPublicUrl(path);
        const { error: insertError } = await supabaseClient.from("photo_submissions").insert({ name: uploader, image_url: urlData.publicUrl, approved: false, content_hash: contentHash, perceptual_hash: visualHash });
        if (insertError) {
          await supabaseClient.storage.from("zayed-photos").remove([path]);
          if (insertError.code === "23505" || /duplicate photo/i.test(insertError.message || "")) { duplicates++; continue; }
          throw insertError;
        }
        submitted++;
      } else {
        let isLocalDuplicate = false;
        for (const photo of addedPhotos) {
          const oldVisualHash = photo.perceptualHash || (photo.blob ? await perceptualHashPhoto(photo.blob) : null);
          if (photo.contentHash === contentHash || perceptualHashesMatch(oldVisualHash, visualHash)) {
            isLocalDuplicate = true;
            break;
          }
        }
        if (isLocalDuplicate) { duplicates++; continue; }
        const photo = { id: crypto.randomUUID(), blob: file, contentHash, perceptualHash: visualHash, title, caption: "Freshly added to the collection.", tag: "NEW ARRIVAL", uploader, local: true };
        await savePhoto(photo);
        addedPhotos.push(photo);
        submitted++;
      }
    }
    if (!submitted && duplicates) {
      error.textContent = "Those photos already appear in the gallery or look like existing photos. No duplicates were added.";
      return;
    }
    contributeForm.reset();
    contributeDialog.close();
    if (supabaseReady) {
      storageNote.textContent = `${submitted} photo${submitted === 1 ? "" : "s"} submitted${duplicates ? `; ${duplicates} duplicate${duplicates === 1 ? "" : "s"} skipped` : ""}. New photos join the shared gallery after approval.`;
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
  "THE CURATOR WOULD LIKE YOU TO KNOW: ENS MBZ IS A CERTIFIED GOOFBALL.",
  "BREAKING: ENS MBZ HAS LOST AN ARGUMENT TO A DOOR THAT SAYS PUSH.",
  "EXPERTS AGREE: ENS MBZ'S LAST BRAIN CELL IS WORKING OVERTIME.",
  "THIS JUST IN: ENS MBZ HAS BEEN CONFUSED BY A SPOON AGAIN.",
  "PLEASE KEEP HANDS INSIDE THE INTERNET. ENS MBZ IS DRIVING.",
  "ENS MBZ IS PROOF THAT CONFIDENCE AND CLUELESSNESS CAN COEXIST."
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

// The Discord /site command changes this shared value in Supabase. Poll so an
// already-open tab also switches to the pause screen without a manual refresh.
const sitePaused = document.querySelector("#sitePaused");
const siteControlUrl = `${supabaseSettings.url || "https://vuxenevtawplaklregbz.supabase.co"}/functions/v1/dynamic-function/site-control`;
async function refreshSiteStatus() {
  try {
    const response = await fetch(siteControlUrl, { cache: "no-store" });
    if (!response.ok) return;
    const status = await response.json();
    const paused = status.is_live === false;
    sitePaused.hidden = !paused;
    document.body.classList.toggle("is-site-paused", paused);
    if (paused) loopAudio.pause();
    else if (loopAudio.paused) startAudio();
  } catch {
    // Keep the site available if Supabase is temporarily unreachable.
  }
}
refreshSiteStatus();
window.setInterval(refreshSiteStatus, 20000);
