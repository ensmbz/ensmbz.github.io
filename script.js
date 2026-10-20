const basePhotos = [
  { id: "base-0823", src: "assets/IMG_0823.PNG", title: "ENS MBZ vs. lunch", caption: "The rice has more brain cells. Probably.", tag: "RICE INCIDENT" },
  { id: "base-0822", src: "assets/IMG_0822.PNG", title: "The thinking close-up", caption: "Searching for the last brain cell…", tag: "LOADING..." },
  { id: "base-0821", src: "assets/IMG_0821.PNG", title: "Backseat philosopher", caption: "Has thoughts. We assume.", tag: "ROAD EDITION" }
];
const translations = {
  en: {
    pauseEyebrow: "ENS MBZ PHOTO MUSEUM", pauseTitle: 'TAKING A<br>BREAK<span class="period">.</span>',
    pausedMessage: "The site owner has paused the museum. Please check back later.",
    ticker: "★ THE ENS MBZ FILES ★ VERY IMPORTANT GOOFINESS ★ THINKING OPTIONAL ★ NO CONTEXT REQUIRED ★ THE ENS MBZ FILES ★ VERY IMPORTANT GOOFINESS ★ THINKING OPTIONAL ★ NO CONTEXT REQUIRED ★",
    navGallery: "THE GALLERY", navAbout: "ABOUT THIS MASTERPIECE", autoAudio: "AUTO-LOOP AUDIO",
    heroEyebrow: "ENS MBZ ARCHIVE · THINKING NOT REQUIRED", heroTitle: 'THE<br><span class="headline-last">ENS MBZ</span> MUSEUM<span class="period">.</span>',
    heroDescription: "A collection of moments, expressions, and one unexpected meeting with lunch. Certified goofball. Questionable decisions. Excellent photo collection.",
    tourLink: "TAKE THE TOUR", scribbleOne: "brain cell<br>loading...", scribbleTwo: "← swipe<br>for evidence",
    scrollExhibition: "SCROLL FOR THE EXHIBITION", figureLabel: "FIG. 001 — ∞", collection: "THE PERMANENT COLLECTION",
    galleryTitle: 'THE GALLERY<span class="period">.</span>', addPhotos: "ADD YOUR PHOTOS", galleryNote: "Museum rule #1: there are no bad angles, only interesting evidence.",
    dropHint: 'Got more? Drop photos anywhere in the gallery or tap “Add your photos”.', soundtrackEyebrow: "PLEASE ENJOY ENS MBZ'S VERY SERIOUS SOUNDTRACK",
    themeStamp: "ENS MBZ'S<br>OFFICIAL<br>THEME", jingleTitle: "THE OFFICIAL<br>ENS MBZ <em>JINGLE.</em>",
    jingleDescription: "ENS MBZ's signature sound effect, on an endless loop. Your browser may require a tap anywhere on the page before it allows audio.",
    jingleStatus: "♪ DRY FART · ON REPEAT", formEyebrow: "ADD TO THE ENS MBZ ARCHIVE", formTitle: 'SUBMIT A PHOTO<span class="period">.</span>',
    nameLabel: 'YOUR NAME <span>(required)</span>', namePlaceholder: "Who is submitting this?", filesLabel: 'PHOTO FILES <span>(required · choose from photos or camera)</span>',
    formHelp: "Your name will appear next to the photos. Submissions are saved in this browser on this device.",
    submitButton: "ADD TO THE GALLERY ↗", close: "Close", storageShared: "Photos are submitted to the shared gallery and appear after ENS MBZ approves them.",
    storageLocal: "Shared uploads are not connected yet. Photos you add are saved in this browser on this device.",
    objectOne: "OBJECT", objectMany: "OBJECTS", emptyGallery: "THE GALLERY IS TAKING A NAP. ADD A PHOTO TO WAKE IT UP.",
    number: "NO.", addedBy: "Added by", newArrival: "NEW ARRIVAL", expand: "Expand", remove: "Remove",
    requiredName: "Please enter your name before submitting.", chooseImage: "Please choose at least one image.", sizeLimit: "Each photo must be smaller than 5 MB.",
    duplicates: "Those photos already appear in the gallery or look like existing photos. No duplicates were added.",
    photosSubmitted: "photos submitted", photoSubmitted: "photo submitted", duplicateSkipped: "duplicate(s) skipped", afterApproval: "New photos join the shared gallery after approval.",
    uploadFailed: "Upload failed", checkBucket: "check the Supabase bucket and policies, then try again.", localSaveFailed: "This browser couldn't save the photo. Try a smaller image or another browser.",
    galleryLoadFailed: "The shared gallery could not load. Check the Supabase table and access policies.",
    quipButton: "ROAST HIM AGAIN ↻", initialQuip: "THE CURATOR WOULD LIKE YOU TO KNOW: ENS MBZ IS A CERTIFIED GOOFBALL.",
    footerNote: "A SMALL INTERNET MUSEUM. ONE LARGE GOOFBALL.", backTop: "BACK TO TOP ↑", languageButton: "العربية (الإمارات)",
  },
  ar: {
    pauseEyebrow: "متحف صور المدرسة الإماراتية في مدينة زايد", pauseTitle: 'نأخذ<br>استراحة<span class="period">.</span>',
    pausedMessage: "أوقف مالك الموقع المتحف مؤقتاً. تفقّد الموقع لاحقاً.",
    ticker: "★ ملفات المدرسة الإماراتية في مدينة زايد ★ عبث مهم جداً ★ التفكير اختياري ★ لا حاجة للسياق ★ ملفات المدرسة الإماراتية في مدينة زايد ★ عبث مهم جداً ★ التفكير اختياري ★ لا حاجة للسياق ★",
    navGallery: "المعرض", navAbout: "عن هذه التحفة", autoAudio: "صوت متكرر تلقائياً",
    heroEyebrow: "أرشيف المدرسة الإماراتية · التفكير غير مطلوب", heroTitle: 'متحف<br><span class="headline-last">ENS MBZ</span><span class="period">.</span>',
    heroDescription: "مجموعة من اللحظات والتعابير ولقاء غير متوقع مع الغداء. خفة ظل معتمدة، وقرارات مثيرة للجدل، ومجموعة صور ممتازة.",
    tourLink: "ابدأ الجولة", scribbleOne: "خلية دماغية<br>جارٍ التحميل...", scribbleTwo: "← اسحب<br>لرؤية الأدلة",
    scrollExhibition: "مرّر لاستكشاف المعرض", figureLabel: "الصورة ٠٠١ — ∞", collection: "المجموعة الدائمة",
    galleryTitle: 'المعرض<span class="period">.</span>', addPhotos: "أضف صورك", galleryNote: "قاعدة المتحف الأولى: لا توجد زوايا سيئة، بل أدلة مثيرة للاهتمام.",
    dropHint: 'هل لديك المزيد؟ أفلِت الصور في أي مكان بالمعرض أو اضغط «أضف صورك».', soundtrackEyebrow: "استمتعوا بالموسيقى الرسمية والجدية جداً لـ ENS MBZ",
    themeStamp: "النشيد<br>الرسمي<br>لـ ENS MBZ", jingleTitle: 'النشيد الرسمي<br>لـ ENS MBZ<span class="period">.</span>',
    jingleDescription: "المؤثر الصوتي المميز لـ ENS MBZ، في تكرار مستمر. قد يحتاج المتصفح إلى نقرة على الصفحة قبل تشغيل الصوت.",
    jingleStatus: "♪ صوت ضرطة · يتكرر", formEyebrow: "أضف إلى أرشيف ENS MBZ", formTitle: 'أرسل صورة<span class="period">.</span>',
    nameLabel: 'اسمك <span>(مطلوب)</span>', namePlaceholder: "من يرسل الصورة؟", filesLabel: 'ملفات الصور <span>(مطلوبة · اختر من الصور أو الكاميرا)</span>',
    formHelp: "سيظهر اسمك بجانب الصور. تُحفظ المشاركات في هذا المتصفح على هذا الجهاز.",
    submitButton: "أضف إلى المعرض ↗", close: "إغلاق", storageShared: "تُرسل الصور إلى المعرض المشترك وتظهر بعد موافقة ENS MBZ عليها.",
    storageLocal: "الرفع المشترك غير متصل حالياً. تُحفظ الصور التي تضيفها في هذا المتصفح على هذا الجهاز.",
    objectOne: "صورة", objectMany: "صور", emptyGallery: "المعرض يأخذ قيلولة. أضف صورة لإيقاظه.",
    number: "رقم", addedBy: "أضافها", newArrival: "إضافة جديدة", expand: "تكبير", remove: "إزالة",
    requiredName: "يرجى كتابة اسمك قبل الإرسال.", chooseImage: "يرجى اختيار صورة واحدة على الأقل.", sizeLimit: "يجب أن يكون حجم كل صورة أقل من ٥ ميغابايت.",
    duplicates: "هذه الصور موجودة في المعرض أو تشبه صوراً موجودة. لم تتم إضافة نسخ مكررة.",
    photosSubmitted: "صور تم إرسالها", photoSubmitted: "صورة تم إرسالها", duplicateSkipped: "نسخ مكررة تم تخطيها", afterApproval: "تُضاف الصور الجديدة إلى المعرض المشترك بعد الموافقة عليها.",
    uploadFailed: "تعذّر رفع الصور", checkBucket: "تحقق من إعدادات Supabase ثم حاول مرة أخرى.", localSaveFailed: "تعذّر حفظ الصورة في هذا المتصفح. جرّب صورة أصغر أو متصفحاً آخر.",
    galleryLoadFailed: "تعذّر تحميل المعرض المشترك. تحقق من جدول Supabase وسياسات الوصول.",
    quipButton: "أطلق مزحة أخرى ↻", initialQuip: "يرجى العلم: ENS MBZ مشاغب معتمد.",
    footerNote: "متحف صغير على الإنترنت. ومشاغب كبير.", backTop: "العودة للأعلى ↑", languageButton: "English",
  },
};
let currentLanguage = (() => {
  try { return localStorage.getItem("ensmbz-language") === "ar" ? "ar" : "en"; }
  catch { return "en"; }
})();
function tr(key) { return translations[currentLanguage][key] ?? translations.en[key] ?? key; }
const arabicBasePhotoText = {
  "base-0823": { title: "ENS MBZ في مواجهة الغداء", caption: "الأرز فيه خلايا دماغية أكثر. غالباً.", tag: "حادثة الأرز" },
  "base-0822": { title: "لقطة التفكير العميق", caption: "نبحث عن آخر خلية دماغية...", tag: "جارٍ التحميل" },
  "base-0821": { title: "فيلسوف المقعد الخلفي", caption: "لديه أفكار. على ما يبدو.", tag: "نسخة الطريق" },
};
function photoText(photo, field) {
  return currentLanguage === "ar" ? (arabicBasePhotoText[photo.id]?.[field] || photo[field]) : photo[field];
}
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
  const localizedCount = currentLanguage === "ar"
    ? new Intl.NumberFormat("ar-AE", { minimumIntegerDigits: 2 }).format(photos.length)
    : String(photos.length).padStart(2, "0");
  count.textContent = `${localizedCount} ${photos.length === 1 ? tr("objectOne") : tr("objectMany")}`;
  if (!photos.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = tr("emptyGallery");
    grid.append(empty);
    return;
  }
  photos.forEach((photo, index) => {
    const card = document.createElement("article");
    card.className = "photo-card";
    const imageButton = document.createElement("button");
    imageButton.className = "photo-image";
    imageButton.type = "button";
    imageButton.setAttribute("aria-label", `${tr("expand")} ${photoText(photo, "title")}`);
    const image = document.createElement("img");
    image.src = photo.src || URL.createObjectURL(photo.blob);
    image.alt = photoText(photo, "title");
    image.loading = index < 3 ? "eager" : "lazy";
    imageButton.append(image);
    const number = document.createElement("span");
    number.className = "photo-index";
    const localizedIndex = currentLanguage === "ar"
      ? new Intl.NumberFormat("ar-AE", { minimumIntegerDigits: 3 }).format(index + 1)
      : String(index + 1).padStart(3, "0");
    number.textContent = `${tr("number")} ${localizedIndex}`;
    imageButton.append(number);
    imageButton.addEventListener("click", () => {
      document.querySelector("#dialogImage").src = image.src;
      document.querySelector("#dialogImage").alt = photoText(photo, "title");
      document.querySelector("#dialogCaption").textContent = `${photoText(photo, "title")} — ${photoText(photo, "caption")}`;
      dialog.showModal();
    });
    card.append(imageButton);
    if (photo.local) {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove-photo";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `${tr("remove")} ${photoText(photo, "title")}`);
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
    title.textContent = photoText(photo, "title");
    const caption = document.createElement("div");
    caption.className = "photo-caption";
    const captionText = photoText(photo, "caption");
    caption.textContent = photo.uploader ? `${captionText} ${tr("addedBy")} ${photo.uploader}.` : captionText;
    text.append(title, caption);
    const tag = document.createElement("span");
    tag.className = "photo-tag";
    tag.textContent = photoText(photo, "tag") || tr("newArrival");
    info.append(text, tag);
    card.append(info);
    grid.append(card);
  });
}

const contributeDialog = document.querySelector("#contributeDialog");
const contributeForm = document.querySelector("#contributeForm");
const storageNote = document.querySelector("#storageNote");
const storageMessageKey = supabaseReady && supabaseClient ? "storageShared" : "storageLocal";
storageNote.textContent = tr(storageMessageKey);
document.querySelector("#addPhotos").addEventListener("click", () => contributeDialog.showModal());
document.querySelector("#contributeClose").addEventListener("click", () => contributeDialog.close());
contributeDialog.addEventListener("click", (event) => { if (event.target === contributeDialog) contributeDialog.close(); });
contributeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const uploader = document.querySelector("#submitterName").value.trim();
  const files = [...input.files].filter((file) => file.type.startsWith("image/") || /\.(avif|bmp|gif|heic|heif|jpe?g|png|svg|tiff?|webp)$/i.test(file.name));
  const error = document.querySelector("#formError");
  if (!uploader) { error.textContent = tr("requiredName"); return; }
  if (!files.length) { error.textContent = tr("chooseImage"); return; }
  if (files.some((file) => file.size > 5 * 1024 * 1024)) { error.textContent = tr("sizeLimit"); return; }
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
      error.textContent = tr("duplicates");
      return;
    }
    contributeForm.reset();
    contributeDialog.close();
    if (supabaseReady) {
      const submittedText = `${submitted} ${submitted === 1 ? tr("photoSubmitted") : tr("photosSubmitted")}`;
      const duplicateText = duplicates ? `; ${duplicates} ${tr("duplicateSkipped")}` : "";
      storageNote.textContent = `${submittedText}${duplicateText}. ${tr("afterApproval")}`;
    }
    render();
  } catch (uploadError) {
    error.textContent = supabaseReady
      ? `${tr("uploadFailed")}: ${uploadError.message || tr("checkBucket")}`
      : tr("localSaveFailed");
  }
});
for (const eventName of ["dragenter", "dragover"]) section.addEventListener(eventName, (event) => { event.preventDefault(); section.classList.add("dragging"); });
for (const eventName of ["dragleave", "drop"]) section.addEventListener(eventName, (event) => { event.preventDefault(); if (eventName === "drop") { input.files = event.dataTransfer.files; input.dispatchEvent(new Event("change")); } section.classList.remove("dragging"); });
document.querySelector("#dialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

const quips = {
  en: [
    "THE CURATOR WOULD LIKE YOU TO KNOW: ENS MBZ IS A CERTIFIED GOOFBALL.",
    "BREAKING: ENS MBZ HAS LOST AN ARGUMENT TO A DOOR THAT SAYS PUSH.",
    "EXPERTS AGREE: ENS MBZ'S LAST BRAIN CELL IS WORKING OVERTIME.",
    "THIS JUST IN: ENS MBZ HAS BEEN CONFUSED BY A SPOON AGAIN.",
    "PLEASE KEEP HANDS INSIDE THE INTERNET. ENS MBZ IS DRIVING.",
    "ENS MBZ IS PROOF THAT CONFIDENCE AND CLUELESSNESS CAN COEXIST."
  ],
  ar: [
    "يرجى العلم: ENS MBZ مشاغب معتمد.",
    "عاجل: خسر ENS MBZ نقاشاً مع باب كُتب عليه «ادفع».",
    "يتفق الخبراء: آخر خلية دماغية لدى ENS MBZ تعمل لساعات إضافية.",
    "خبر عاجل: اختلط الأمر على ENS MBZ بسبب ملعقة مرة أخرى.",
    "يرجى إبقاء الأيدي داخل الإنترنت. ENS MBZ هو السائق.",
    "ENS MBZ دليل على أن الثقة والحيرة قد تجتمعان."
  ],
};
let previousQuip = 0;
document.querySelector("#quipButton").addEventListener("click", () => {
  const options = quips[currentLanguage];
  let next = Math.floor(Math.random() * options.length);
  if (next === previousQuip) next = (next + 1) % options.length;
  previousQuip = next;
  document.querySelector("#quip").textContent = options[next];
});

function applyLanguage(language = currentLanguage) {
  currentLanguage = language === "ar" ? "ar" : "en";
  const isArabic = currentLanguage === "ar";
  document.documentElement.lang = isArabic ? "ar-AE" : "en";
  document.documentElement.dir = isArabic ? "rtl" : "ltr";
  for (const element of document.querySelectorAll("[data-i18n], [data-i18n-html]")) {
    const key = element.dataset.i18n || element.dataset.i18nHtml;
    const value = tr(key);
    if (element.hasAttribute("data-i18n-html")) element.innerHTML = value;
    else element.textContent = value;
  }
  for (const element of document.querySelectorAll("[data-i18n-placeholder]")) {
    element.placeholder = tr(element.dataset.i18nPlaceholder);
  }
  for (const element of document.querySelectorAll("[data-i18n-aria-label]")) {
    element.setAttribute("aria-label", tr(element.dataset.i18nAriaLabel));
  }
  for (const button of document.querySelectorAll("[data-language-toggle]")) {
    button.textContent = tr("languageButton");
    button.setAttribute("aria-label", isArabic ? "Switch to English" : "التبديل إلى العربية الإماراتية");
    button.title = isArabic ? "Switch to English" : "التبديل إلى العربية الإماراتية";
  }
  document.title = isArabic ? "متحف ENS MBZ — ملفات ENS MBZ" : "ENS MBZ Museum — The ENS MBZ Files";
  document.querySelector("#quipButton").setAttribute("aria-label", isArabic ? "أطلق مزحة أخرى عن ENS MBZ" : "Generate another ENS MBZ roast");
  document.querySelector("#quip").textContent = tr("initialQuip");
  storageNote.textContent = tr(storageMessageKey);
  try { localStorage.setItem("ensmbz-language", currentLanguage); } catch { /* Language still changes for this page view. */ }
  render();
}
for (const button of document.querySelectorAll("[data-language-toggle]")) {
  button.addEventListener("click", () => applyLanguage(currentLanguage === "ar" ? "en" : "ar"));
}
applyLanguage();

// Autoplay the supplied sound effect and keep it looping. If the browser
// blocks audible autoplay, retry on the visitor's first page interaction.
const loopAudio = document.querySelector("#loopAudio");
const pauseAudio = document.querySelector("#pauseAudio");
let siteIsPaused = false;
let siteStatusKnown = false;
loopAudio.volume = 0.45;
pauseAudio.volume = 0.45;
async function startAudio() {
  const selectedAudio = siteIsPaused ? pauseAudio : loopAudio;
  const otherAudio = siteIsPaused ? loopAudio : pauseAudio;
  otherAudio.pause();
  try {
    await selectedAudio.play();
    document.querySelector(".music-art")?.classList.toggle("playing", !siteIsPaused);
  } catch { /* Browser autoplay policy may require a visitor interaction. */ }
}
document.addEventListener("pointerdown", () => {
  if (siteStatusKnown && (siteIsPaused ? pauseAudio : loopAudio).paused) startAudio();
});
document.addEventListener("keydown", () => {
  if (siteStatusKnown && (siteIsPaused ? pauseAudio : loopAudio).paused) startAudio();
});

async function loadSharedPhotos() {
  if (!supabaseReady || !supabaseClient) return;
  const { data, error } = await supabaseClient.from("photo_submissions")
    .select("id,name,image_url,created_at")
    .eq("approved", true)
    .order("created_at", { ascending: false });
  if (error) {
    storageNote.textContent = tr("galleryLoadFailed");
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
    siteIsPaused = paused;
    siteStatusKnown = true;
    sitePaused.hidden = !paused;
    document.body.classList.toggle("is-site-paused", paused);
    if ((paused ? pauseAudio : loopAudio).paused) startAudio();
  } catch {
    // Keep the site available if Supabase is temporarily unreachable.
  }
}
refreshSiteStatus();
window.setInterval(refreshSiteStatus, 20000);
