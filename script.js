const translations = {
  en: {
    pauseEyebrow: "ENS MBZ PHOTO MUSEUM", pauseTitle: 'TAKING A<br>BREAK<span class="period">.</span>',
    pausedMessage: "The site owner has paused the museum. Please check back later.",
    ticker: "★ THE ENS MBZ FILES ★ VERY IMPORTANT GOOFINESS ★ THINKING OPTIONAL ★ NO CONTEXT REQUIRED ★ THE ENS MBZ FILES ★ VERY IMPORTANT GOOFINESS ★ THINKING OPTIONAL ★ NO CONTEXT REQUIRED ★",
    navGallery: "THE GALLERY", navAbout: "ABOUT THIS MASTERPIECE",
    heroEyebrow: "ENS MBZ ARCHIVE · THINKING NOT REQUIRED", heroTitle: 'THE<br><span class="headline-last">ENS MBZ</span> MUSEUM<span class="period">.</span>',
    heroDescription: "A collection of moments, expressions, and one unexpected meeting with lunch. Certified goofball. Questionable decisions. Excellent photo collection.",
    tourLink: "TAKE THE TOUR", scribbleOne: "brain cell<br>loading...", scribbleTwo: "← swipe<br>for evidence",
    scrollExhibition: "SCROLL FOR THE EXHIBITION", figureLabel: "FIG. 001 — ∞", collection: "THE PERMANENT COLLECTION",
    galleryTitle: 'THE GALLERY<span class="period">.</span>', addPhotos: "ADD PHOTOS OR VIDEOS", galleryNote: "Museum rule #1: there are no bad angles, only interesting evidence.",
    dropHint: 'Got more? Drop photos or videos anywhere in the gallery or tap “Add your photos”.', formEyebrow: "ADD TO THE ENS MBZ ARCHIVE", formTitle: 'SUBMIT MEDIA<span class="period">.</span>',
    nameLabel: 'YOUR NAME <span>(required)</span>', namePlaceholder: "Who is submitting this?", filesLabel: 'PHOTOS OR VIDEOS <span>(required · photos up to 5 MB, videos up to 50 MB)</span>',
    chooseMedia: "CHOOSE PHOTOS OR VIDEOS", noMediaSelected: "No media selected", mediaSelected: "item selected", mediaSelectedMany: "items selected",
    formHelp: "Your name will appear next to the photos or videos. MP4 works best; use the video controls to hear its audio. Submissions appear after approval.",
    submitButton: "ADD TO THE GALLERY ↗", close: "Close", storageShared: "Photos and videos are submitted to the shared gallery and appear after ENS MBZ approves them.",
    storageLocal: "Shared uploads are not connected yet. Media you add is saved in this browser on this device.",
    objectOne: "OBJECT", objectMany: "OBJECTS", emptyGallery: "THE GALLERY IS TAKING A NAP. ADD A PHOTO TO WAKE IT UP.",
    number: "NO.", addedBy: "Added by", newArrival: "NEW ARRIVAL", expand: "Expand", remove: "Remove",
    requiredName: "Please enter your name before submitting.", chooseImage: "Please choose at least one photo or video.", sizeLimit: "Photos must be under 5 MB and videos under 50 MB.",
    photosSubmitted: "items submitted", photoSubmitted: "item submitted", afterApproval: "New photos and videos join the shared gallery after approval.",
    uploadFailed: "Upload failed", checkBucket: "check the Supabase bucket size limit and policies, then try again.", localSaveFailed: "This browser couldn't save the media. Try a smaller file or another browser.",
    galleryLoadFailed: "The shared gallery could not load. Check the Supabase table and access policies.",
    quipButton: "ROAST HIM AGAIN ↻", initialQuip: "THE CURATOR WOULD LIKE YOU TO KNOW: ENS MBZ IS A CERTIFIED GOOFBALL.",
    footerNote: "A SMALL INTERNET MUSEUM. ONE LARGE GOOFBALL.", backTop: "BACK TO TOP ↑", languageButton: "العربية",
  },
  ar: {
    pauseEyebrow: "متحف صور المدرسة الإماراتية في مدينة زايد", pauseTitle: 'نأخذ<br>استراحة<span class="period">.</span>',
    pausedMessage: "أوقف مالك الموقع المتحف مؤقتاً. تفقّد الموقع لاحقاً.",
    ticker: "★ ملفات المدرسة الإماراتية في مدينة زايد ★ عبث مهم جداً ★ التفكير اختياري ★ لا حاجة للسياق ★ ملفات المدرسة الإماراتية في مدينة زايد ★ عبث مهم جداً ★ التفكير اختياري ★ لا حاجة للسياق ★",
    navGallery: "المعرض", navAbout: "عن هذه التحفة",
    heroEyebrow: "أرشيف المدرسة الإماراتية · التفكير غير مطلوب", heroTitle: 'متحف<br><span class="headline-last">ENS MBZ</span><span class="period">.</span>',
    heroDescription: "مجموعة من اللحظات والتعابير ولقاء غير متوقع مع الغداء. خفة ظل معتمدة، وقرارات مثيرة للجدل، ومجموعة صور ممتازة.",
    tourLink: "ابدأ الجولة", scribbleOne: "خلية دماغية<br>جارٍ التحميل...", scribbleTwo: "← اسحب<br>لرؤية الأدلة",
    scrollExhibition: "مرّر لاستكشاف المعرض", figureLabel: "الصورة ٠٠١ — ∞", collection: "المجموعة الدائمة",
    galleryTitle: 'المعرض<span class="period">.</span>', addPhotos: "أضف صوراً أو فيديو", galleryNote: "قاعدة المتحف الأولى: لا توجد زوايا سيئة، بل أدلة مثيرة للاهتمام.",
    dropHint: 'هل لديك المزيد؟ أفلِت الصور أو الفيديوهات في أي مكان بالمعرض أو اضغط «أضف صورك».', formEyebrow: "أضف إلى أرشيف ENS MBZ", formTitle: 'أرسل صوراً أو فيديو<span class="period">.</span>',
    nameLabel: 'اسمك <span>(مطلوب)</span>', namePlaceholder: "من يرسل الصور أو الفيديو؟", filesLabel: 'صور أو فيديوهات <span>(مطلوب · الصور حتى ٥ م.ب. والفيديو حتى ٥٠ م.ب.)</span>',
    chooseMedia: "اختر صوراً أو فيديوهات", noMediaSelected: "لم يتم اختيار ملفات", mediaSelected: "ملف تم اختياره", mediaSelectedMany: "ملفات تم اختيارها",
    formHelp: "سيظهر اسمك بجانب الصور أو الفيديوهات. صيغة MP4 هي الأفضل؛ استخدم أدوات الفيديو لتشغيل الصوت. تظهر المشاركات بعد الموافقة.",
    submitButton: "أضف إلى المعرض ↗", close: "إغلاق", storageShared: "تُرسل الصور والفيديوهات إلى المعرض المشترك وتظهر بعد موافقة ENS MBZ عليها.",
    storageLocal: "الرفع المشترك غير متصل حالياً. تُحفظ الوسائط التي تضيفها في هذا المتصفح على هذا الجهاز.",
    objectOne: "صورة", objectMany: "صور", emptyGallery: "المعرض يأخذ قيلولة. أضف صورة لإيقاظه.",
    number: "رقم", addedBy: "أضافها", newArrival: "إضافة جديدة", expand: "تكبير", remove: "إزالة",
    requiredName: "يرجى كتابة اسمك قبل الإرسال.", chooseImage: "يرجى اختيار صورة أو فيديو واحد على الأقل.", sizeLimit: "يجب أن تكون الصور أصغر من ٥ م.ب. والفيديوهات أصغر من ٥٠ م.ب.",
    photosSubmitted: "ملفات تم إرسالها", photoSubmitted: "ملف تم إرساله", afterApproval: "تُضاف الصور والفيديوهات الجديدة إلى المعرض المشترك بعد الموافقة عليها.",
    uploadFailed: "تعذّر رفع الملف", checkBucket: "تحقق من حد حجم الملفات في Supabase وسياسات التخزين ثم حاول مجدداً.", localSaveFailed: "تعذّر حفظ الوسائط في هذا المتصفح. جرّب ملفاً أصغر أو متصفحاً آخر.",
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
const videoFilePattern = /\.(mp4|m4v|mov|webm|ogv)$/i;
function isVideoFile(file) {
  return ["video/mp4", "video/webm", "video/quicktime", "video/ogg", "video/x-m4v"].includes(file.type.toLowerCase()) || videoFilePattern.test(file.name);
}
function photoText(photo, field) { return photo[field]; }
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
  const photos = [...sharedPhotos, ...addedPhotos];
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
    const mediaSrc = photo.src || (photo.blob ? URL.createObjectURL(photo.blob) : "");
    const isVideo = photo.mediaType === "video" || photo.media_type === "video" || (photo.blob && isVideoFile(photo.blob)) || videoFilePattern.test(mediaSrc);
    const mediaFrame = document.createElement(isVideo ? "div" : "button");
    mediaFrame.className = "photo-image";
    if (isVideo) {
      const video = document.createElement("video");
      video.className = "photo-video";
      video.src = mediaSrc;
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.setAttribute("aria-label", photoText(photo, "title"));
      mediaFrame.append(video);
    } else {
      mediaFrame.type = "button";
      mediaFrame.setAttribute("aria-label", `${tr("expand")} ${photoText(photo, "title")}`);
      const image = document.createElement("img");
      image.src = mediaSrc;
      image.alt = photoText(photo, "title");
      image.loading = index < 3 ? "eager" : "lazy";
      mediaFrame.append(image);
      mediaFrame.addEventListener("click", () => {
        const dialogImage = document.querySelector("#dialogImage");
        const dialogVideo = document.querySelector("#dialogVideo");
        dialogVideo.pause();
        dialogVideo.hidden = true;
        dialogImage.hidden = false;
        dialogImage.src = image.src;
        dialogImage.alt = photoText(photo, "title");
        document.querySelector("#dialogCaption").textContent = `${photoText(photo, "title")} — ${photoText(photo, "caption")}`;
        dialog.showModal();
      });
    }
    const number = document.createElement("span");
    number.className = "photo-index";
    const localizedIndex = currentLanguage === "ar"
      ? new Intl.NumberFormat("ar-AE", { minimumIntegerDigits: 3 }).format(index + 1)
      : String(index + 1).padStart(3, "0");
    number.textContent = `${tr("number")} ${localizedIndex}`;
    mediaFrame.append(number);
    card.append(mediaFrame);
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
const choosePhotosButton = document.querySelector("#choosePhotosButton");
const photoSelectionStatus = document.querySelector("#photoSelectionStatus");
function updatePhotoSelectionStatus() {
  const selectedCount = input.files?.length || 0;
  if (!selectedCount) photoSelectionStatus.textContent = tr("noMediaSelected");
  else photoSelectionStatus.textContent = `${selectedCount} ${selectedCount === 1 ? tr("mediaSelected") : tr("mediaSelectedMany")}`;
}
choosePhotosButton.addEventListener("click", () => input.click());
input.addEventListener("change", updatePhotoSelectionStatus);
document.querySelector("#contributeClose").addEventListener("click", () => contributeDialog.close());
contributeDialog.addEventListener("click", (event) => { if (event.target === contributeDialog) contributeDialog.close(); });
contributeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const uploader = document.querySelector("#submitterName").value.trim();
  const files = [...input.files].filter((file) => file.type.startsWith("image/") || isVideoFile(file) || /\.(avif|bmp|gif|heic|heif|jpe?g|png|svg|tiff?|webp)$/i.test(file.name));
  const error = document.querySelector("#formError");
  if (!uploader) { error.textContent = tr("requiredName"); return; }
  if (!files.length) { error.textContent = tr("chooseImage"); return; }
  if (files.some((file) => file.size > (isVideoFile(file) ? 50 : 5) * 1024 * 1024)) { error.textContent = tr("sizeLimit"); return; }
  error.textContent = "";
  try {
    let submitted = 0;
    for (const file of files) {
      const title = file.name.replace(/\.[^.]+$/, "") || "A new masterpiece";
      const mediaType = isVideoFile(file) ? "video" : "image";
      if (supabaseReady && supabaseClient) {
        const contentType = file.type || (mediaType === "video" ? "video/mp4" : "image/jpeg");
        let publicUrl;
        let cleanupSupabasePath = "";
        if (supabaseSettings.mediaStorageProvider === "r2") {
          const uploadUrlResponse = await fetch(`${supabaseSettings.url.replace(/\/$/, "")}/functions/v1/dynamic-function/media-upload-url`, {
            method: "POST",
            headers: { apikey: supabaseSettings.publishableKey, authorization: `Bearer ${supabaseSettings.publishableKey}`, "content-type": "application/json" },
            body: JSON.stringify({ name: file.name, contentType, size: file.size }),
          });
          const uploadTarget = await uploadUrlResponse.json().catch(() => ({}));
          if (!uploadUrlResponse.ok || !uploadTarget.uploadUrl || !uploadTarget.publicUrl) throw new Error(uploadTarget.error || "Could not prepare the media upload.");
          const uploadResponse = await fetch(uploadTarget.uploadUrl, { method: "PUT", headers: { "content-type": contentType }, body: file });
          if (!uploadResponse.ok) throw new Error(`R2 upload failed (HTTP ${uploadResponse.status}). Check the bucket CORS settings.`);
          publicUrl = uploadTarget.publicUrl;
        } else {
          const extension = file.name.match(/\.[a-zA-Z0-9]{1,10}$/)?.[0]?.toLowerCase() || (mediaType === "video" ? ".mp4" : ".jpg");
          const path = `${mediaType === "video" ? "videos" : "photos"}/${crypto.randomUUID()}${extension}`;
          cleanupSupabasePath = path;
          const { error: uploadError } = await supabaseClient.storage.from("zayed-photos").upload(path, file, { upsert: false, contentType });
          if (uploadError) throw uploadError;
          publicUrl = supabaseClient.storage.from("zayed-photos").getPublicUrl(path).data.publicUrl;
        }
        const { error: insertError } = await supabaseClient.from("photo_submissions").insert({ name: uploader, image_url: publicUrl, media_type: mediaType, approved: false });
        if (insertError) {
          if (cleanupSupabasePath) await supabaseClient.storage.from("zayed-photos").remove([cleanupSupabasePath]);
          throw insertError;
        }
        submitted++;
      } else {
        const photo = { id: crypto.randomUUID(), blob: file, mediaType, title, caption: "Freshly added to the collection.", tag: "NEW ARRIVAL", uploader, local: true };
        await savePhoto(photo);
        addedPhotos.push(photo);
        submitted++;
      }
    }
    contributeForm.reset();
    updatePhotoSelectionStatus();
    contributeDialog.close();
    if (supabaseReady) {
      const submittedText = `${submitted} ${submitted === 1 ? tr("photoSubmitted") : tr("photosSubmitted")}`;
      storageNote.textContent = `${submittedText}. ${tr("afterApproval")}`;
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
dialog.addEventListener("close", () => {
  const video = document.querySelector("#dialogVideo");
  video.pause();
  video.removeAttribute("src");
  video.load();
});

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
    button.querySelector("[data-language-label]").textContent = tr("languageButton");
    button.querySelector("[data-language-icon]").textContent = isArabic ? "EN" : "🇦🇪";
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
  button.addEventListener("click", () => {
    applyLanguage(currentLanguage === "ar" ? "en" : "ar");
  });
}
applyLanguage();

// The 404 audio only plays while the owner has paused the site.
const pauseAudio = document.querySelector("#pauseAudio");
let siteIsPaused = false;
let siteStatusKnown = false;
pauseAudio.volume = 0.45;
async function startPauseAudio() {
  if (!siteIsPaused) return;
  try {
    await pauseAudio.play();
  } catch { /* Browser autoplay policy may require a visitor interaction. */ }
}
document.addEventListener("pointerdown", () => {
  if (siteStatusKnown && siteIsPaused && pauseAudio.paused) startPauseAudio();
});
document.addEventListener("keydown", () => {
  if (siteStatusKnown && siteIsPaused && pauseAudio.paused) startPauseAudio();
});

async function loadSharedPhotos() {
  if (!supabaseReady || !supabaseClient) return;
  const { data, error } = await supabaseClient.from("photo_submissions")
    .select("id,name,image_url,media_type,created_at")
    .eq("approved", true)
    .order("created_at", { ascending: false });
  if (error) {
    storageNote.textContent = tr("galleryLoadFailed");
    return;
  }
  sharedPhotos = (data || []).map((row) => ({
    id: `shared-${row.id}`, src: row.image_url, mediaType: row.media_type || "image", title: "A community masterpiece",
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
    if (paused) {
      if (pauseAudio.paused) startPauseAudio();
    } else if (!pauseAudio.paused) {
      pauseAudio.pause();
      pauseAudio.currentTime = 0;
    }
  } catch {
    // Keep the site available if Supabase is temporarily unreachable.
  }
}
refreshSiteStatus();
window.setInterval(refreshSiteStatus, 20000);
