const translations = {
  en: {
    pauseEyebrow: "THE EXHIBITION IS RESTING", pauseTitle: 'TAKING A<br>BREAK<span class="period">.</span>', panicMessage: "YOU CAN'T FIND ME.",
    pausedMessage: "The collection is temporarily closed. The frames are staying put and the archive will return soon.",
    ticker: "★ THE ENS MBZ FILES ★ VERY IMPORTANT GOOFINESS ★ THINKING OPTIONAL ★ NO CONTEXT REQUIRED ★ THE ENS MBZ FILES ★ VERY IMPORTANT GOOFINESS ★ THINKING OPTIONAL ★ NO CONTEXT REQUIRED ★",
    navGallery: "THE GALLERY", navChat: "CHAT ROOM", navReport: "REPORT", navAbout: "ABOUT", navOwner: "OWNER",
    heroEyebrow: "ENS MBZ ARCHIVE · CURRENT EXHIBITION", heroTitle: '<span class="hero-line">THE</span><span class="hero-line headline-last">ARCHIVE</span><span class="hero-line">STAYS LOUD<span class="period">.</span></span>',
    heroDescription: "An unofficial exhibition of school memories, unexpected portraits, and moments too good to leave in the camera roll.",
    tourLink: "TAKE THE TOUR", scribbleOne: "brain cell<br>loading...", scribbleTwo: "← swipe<br>for evidence",
    scrollExhibition: "SCROLL FOR THE EXHIBITION", figureLabel: "FIG. 001 — ∞", collection: "THE PERMANENT COLLECTION",
    galleryTitle: 'THE GALLERY<span class="period">.</span>', addPhotos: "ADD PHOTOS OR VIDEOS", galleryNote: "Museum rule #1: there are no bad angles, only interesting evidence.",
    dropHint: 'Got more? Drop photos or videos anywhere in the gallery or tap “Add your photos”.', formEyebrow: "ADD TO THE ENS MBZ ARCHIVE", formTitle: 'SUBMIT MEDIA<span class="period">.</span>',
    nameLabel: 'YOUR NAME <span>(required)</span>', namePlaceholder: "Who is submitting this?", filesLabel: 'PHOTOS OR VIDEOS <span>(required · any file size)</span>',
    descriptionLabel: 'DESCRIPTION <span>(optional)</span>', descriptionPlaceholder: "Tell people about this post",
    chooseMedia: "CHOOSE PHOTOS OR VIDEOS", noMediaSelected: "No media selected", mediaSelected: "item selected", mediaSelectedMany: "items selected",
    formHelp: "Your name will appear next to the photos or videos. MP4 works best; use the video controls to hear its audio. Submissions appear after approval.",
    submitButton: "ADD TO THE GALLERY ↗", submitting: "ADDING…", close: "Close", storageShared: "Photos and videos are submitted to the shared gallery and appear after ENS MBZ approves them.",
    storageLocal: "Shared uploads are not connected yet. Media you add is saved in this browser on this device.",
    objectOne: "OBJECT", objectMany: "OBJECTS", emptyGallery: "THE GALLERY IS TAKING A NAP. ADD A PHOTO TO WAKE IT UP.",
    number: "NO.", addedBy: "Added by", newArrival: "NEW ARRIVAL", expand: "Expand", remove: "Remove",
    requiredName: "Please enter your name before submitting.", chooseImage: "Please choose at least one photo or video.", sizeLimit: "",
    photosSubmitted: "items submitted", photoSubmitted: "item submitted", afterApproval: "New photos and videos join the shared gallery after approval.",
    uploadFailed: "Upload failed", checkBucket: "check the Supabase bucket size limit and policies, then try again.", localSaveFailed: "This browser couldn't save the media. Try a smaller file or another browser.",
    galleryLoadFailed: "The shared gallery could not load. Check the Supabase table and access policies.",
    footerNote: "A SMALL INTERNET MUSEUM. ONE LARGE GOOFBALL.", backTop: "BACK TO TOP ↑", languageButton: "العربية",
    commentsButton: "COMMENTS", takedownButton: "REQUEST TAKEDOWN", commentsEyebrow: "THE CONVERSATION", commentsTitle: 'COMMENTS<span class="period">.</span>', commentsEmpty: "No comments yet. Start the conversation.", commentsUnavailable: "Comments are unavailable right now.", commentNameLabel: "YOUR NAME", commentLabel: "COMMENT", commentPlaceholder: "Keep it nice.", commentSubmit: "POST COMMENT", commentPosting: "POSTING…", commentRequired: "Please enter your name and a comment.", commentPosted: "Your comment was posted.", commentFailed: "Your comment could not be posted. Please try again.", takedownEyebrow: "POST SAFETY", takedownTitle: 'REQUEST TAKEDOWN<span class="period">.</span>', takedownIntro: "Tell the moderators why this post should be removed. Your request is private.", takedownReasonLabel: "WHY SHOULD IT BE REMOVED?", takedownPlaceholder: "Tell the moderators why.", takedownSubmit: "SEND REQUEST", takedownSending: "SENDING…", takedownRequired: "Please enter your name and a reason.", takedownSent: "Your request was sent to the moderators.", takedownFailed: "Your request could not be sent. Please try again.", reportEyebrow: "PRIVATE MODERATION", reportTitle: 'SEND A REPORT<span class="period">.</span>', reportIntro: "Tell the moderators what happened. Your report is private and does not appear in the chat room.", reportNameLabel: "YOUR NAME <span>(OPTIONAL)</span>", reportNamePlaceholder: "Leave blank to stay anonymous", reportBodyLabel: "WHAT DO YOU WANT TO REPORT?", reportBodyPlaceholder: "Give the moderators the details.", reportSubmit: "SEND REPORT", reportSending: "SENDING…", reportRequired: "Please describe what you want to report.", reportSent: "Your report was sent to the moderators.", reportFailed: "Your report could not be sent. Please try again.",
    chatEyebrow: "THE VISITOR BOOK", chatTitle: 'CHAT ROOM<span class="period">.</span>', chatLive: "LIVE ROOM", chatLoading: "Opening the room…", chatEmpty: "The room is quiet. Be the first to say something.", chatUnavailable: "The chat room is unavailable right now.", chatJoin: "JOIN THE CONVERSATION", chatNameLabel: "NAME (OPTIONAL)", chatNamePlaceholder: "Leave blank to post as Guest", chatMessageLabel: "MESSAGE", chatPlaceholder: "Say something to the room…", chatSubmit: "SEND MESSAGE ↗", chatSending: "SENDING…", chatRequired: "Please enter a message.", chatSent: "Message sent.", chatFailed: "Your message could not be sent. Try again.", chatNote: "Be kind. Messages are public.", chatYou: "YOU", musicPlay: "PLAY AMBIENCE", musicStop: "STOP MUSIC",
  },
  ar: {
    pauseEyebrow: "المعرض يستريح الآن", pauseTitle: 'نأخذ<br>استراحة<span class="period">.</span>', panicMessage: "لا يتم العثور على الموقع",
    pausedMessage: "المجموعة مغلقة مؤقتاً. ستبقى الإطارات في مكانها وسيعود الأرشيف قريباً.",
    ticker: "★ ملفات المدرسة الإماراتية في مدينة زايد ★ عبث مهم جداً ★ التفكير اختياري ★ لا حاجة للسياق ★ ملفات المدرسة الإماراتية في مدينة زايد ★ عبث مهم جداً ★ التفكير اختياري ★ لا حاجة للسياق ★",
    navGallery: "المعرض", navChat: "غرفة الدردشة", navReport: "إبلاغ", navAbout: "عن الموقع", navOwner: "المالك",
    heroEyebrow: "أرشيف ENS MBZ · المعرض الحالي", heroTitle: '<span class="hero-line">الأرشيف</span><span class="hero-line headline-last">يبقى</span><span class="hero-line">صاخباً<span class="period">.</span></span>',
    heroDescription: "معرض غير رسمي لذكريات المدرسة وصور غير متوقعة ولحظات أجمل من أن تبقى في ألبوم الكاميرا.",
    tourLink: "ابدأ الجولة", scribbleOne: "خلية دماغية<br>جارٍ التحميل...", scribbleTwo: "← اسحب<br>لرؤية الأدلة",
    scrollExhibition: "مرّر لاستكشاف المعرض", figureLabel: "الصورة ٠٠١ — ∞", collection: "المجموعة الدائمة",
    galleryTitle: 'المعرض<span class="period">.</span>', addPhotos: "أضف صوراً أو فيديو", galleryNote: "قاعدة المتحف الأولى: لا توجد زوايا سيئة، بل أدلة مثيرة للاهتمام.",
    dropHint: 'هل لديك المزيد؟ أفلِت الصور أو الفيديوهات في أي مكان بالمعرض أو اضغط «أضف صورك».', formEyebrow: "أضف إلى أرشيف ENS MBZ", formTitle: 'أرسل صوراً أو فيديو<span class="period">.</span>',
    nameLabel: 'اسمك <span>(مطلوب)</span>', namePlaceholder: "من يرسل الصور أو الفيديو؟", filesLabel: 'صور أو فيديوهات <span>(مطلوب · بأي حجم)</span>',
    descriptionLabel: 'الوصف <span>(اختياري)</span>', descriptionPlaceholder: "أخبر الناس عن هذه المشاركة",
    chooseMedia: "اختر صوراً أو فيديوهات", noMediaSelected: "لم يتم اختيار ملفات", mediaSelected: "ملف تم اختياره", mediaSelectedMany: "ملفات تم اختيارها",
    formHelp: "سيظهر اسمك بجانب الصور أو الفيديوهات. صيغة MP4 هي الأفضل؛ استخدم أدوات الفيديو لتشغيل الصوت. تظهر المشاركات بعد الموافقة.",
    submitButton: "أضف إلى المعرض ↗", submitting: "جارٍ الإضافة…", close: "إغلاق", storageShared: "تُرسل الصور والفيديوهات إلى المعرض المشترك وتظهر بعد موافقة ENS MBZ عليها.",
    storageLocal: "الرفع المشترك غير متصل حالياً. تُحفظ الوسائط التي تضيفها في هذا المتصفح على هذا الجهاز.",
    objectOne: "صورة", objectMany: "صور", emptyGallery: "المعرض يأخذ قيلولة. أضف صورة لإيقاظه.",
    number: "رقم", addedBy: "أضافها", newArrival: "إضافة جديدة", expand: "تكبير", remove: "إزالة",
    requiredName: "يرجى كتابة اسمك قبل الإرسال.", chooseImage: "يرجى اختيار صورة أو فيديو واحد على الأقل.", sizeLimit: "",
    photosSubmitted: "ملفات تم إرسالها", photoSubmitted: "ملف تم إرساله", afterApproval: "تُضاف الصور والفيديوهات الجديدة إلى المعرض المشترك بعد الموافقة عليها.",
    uploadFailed: "تعذّر رفع الملف", checkBucket: "تحقق من حد حجم الملفات في Supabase وسياسات التخزين ثم حاول مجدداً.", localSaveFailed: "تعذّر حفظ الوسائط في هذا المتصفح. جرّب ملفاً أصغر أو متصفحاً آخر.",
    galleryLoadFailed: "تعذّر تحميل المعرض المشترك. تحقق من جدول Supabase وسياسات الوصول.",
    footerNote: "متحف صغير على الإنترنت. ومشاغب كبير.", backTop: "العودة للأعلى ↑", languageButton: "English",
    commentsButton: "التعليقات", takedownButton: "طلب إزالة", commentsEyebrow: "المحادثة", commentsTitle: 'التعليقات<span class="period">.</span>', commentsEmpty: "لا توجد تعليقات بعد. ابدأ المحادثة.", commentsUnavailable: "التعليقات غير متاحة حالياً.", commentNameLabel: "اسمك", commentLabel: "تعليق", commentPlaceholder: "اكتب بلطف.", commentSubmit: "نشر التعليق", commentPosting: "جارٍ النشر…", commentRequired: "يرجى كتابة اسمك وتعليقك.", commentPosted: "تم نشر تعليقك.", commentFailed: "تعذر نشر تعليقك. حاول مرة أخرى.", takedownEyebrow: "سلامة المشاركة", takedownTitle: 'طلب إزالة<span class="period">.</span>', takedownIntro: "أخبر المشرفين بسبب إزالة هذه المشاركة. طلبك خاص.", takedownReasonLabel: "لماذا يجب إزالتها؟", takedownPlaceholder: "أخبر المشرفين بالسبب.", takedownSubmit: "إرسال الطلب", takedownSending: "جارٍ الإرسال…", takedownRequired: "يرجى كتابة اسمك وسبب الطلب.", takedownSent: "تم إرسال طلبك إلى المشرفين.", takedownFailed: "تعذر إرسال طلبك. حاول مرة أخرى.", reportEyebrow: "إشراف خاص", reportTitle: 'إرسال بلاغ<span class="period">.</span>', reportIntro: "أخبر المشرفين بما حدث. بلاغك خاص ولا يظهر في غرفة الدردشة.", reportNameLabel: "اسمك <span>(اختياري)</span>", reportNamePlaceholder: "اتركه فارغاً للإبلاغ دون اسم", reportBodyLabel: "ماذا تريد الإبلاغ عنه؟", reportBodyPlaceholder: "أعطِ المشرفين التفاصيل.", reportSubmit: "إرسال البلاغ", reportSending: "جارٍ الإرسال…", reportRequired: "يرجى وصف ما تريد الإبلاغ عنه.", reportSent: "تم إرسال بلاغك إلى المشرفين.", reportFailed: "تعذر إرسال بلاغك. حاول مرة أخرى.",
    chatEyebrow: "سجل الزوار", chatTitle: 'غرفة الدردشة<span class="period">.</span>', chatLive: "غرفة مباشرة", chatLoading: "جارٍ فتح الغرفة…", chatEmpty: "الغرفة هادئة. كن أول من يكتب.", chatUnavailable: "غرفة الدردشة غير متاحة حالياً.", chatJoin: "انضم إلى المحادثة", chatNameLabel: "الاسم (اختياري)", chatNamePlaceholder: "اتركه فارغاً للنشر باسم زائر", chatMessageLabel: "الرسالة", chatPlaceholder: "اكتب شيئاً للغرفة…", chatSubmit: "إرسال الرسالة ↗", chatSending: "جارٍ الإرسال…", chatRequired: "يرجى كتابة رسالة.", chatSent: "تم إرسال الرسالة.", chatFailed: "تعذر إرسال رسالتك. حاول مرة أخرى.", chatNote: "كن لطيفاً. الرسائل عامة.", chatYou: "أنت", musicPlay: "تشغيل الأجواء", musicStop: "إيقاف الموسيقى",
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

// Cloudflare's free proxy caps a single request near 100 MB. Upload larger
// clips in 50 MB TUS chunks so the Debian storage can still accept them.
async function uploadMedia(path, file, contentType) {
  if (file.size <= 80 * 1024 * 1024) {
    const { error } = await supabaseClient.storage.from("zayed-photos").upload(path, file, { upsert: false, contentType });
    if (error) throw error;
    return;
  }
  const base = (value) => btoa(unescape(encodeURIComponent(value)));
  const api = supabaseSettings.url.replace(/\/$/, "");
  const headers = {
    apikey: supabaseSettings.publishableKey,
    authorization: `Bearer ${supabaseSettings.publishableKey}`,
    "tus-resumable": "1.0.0",
    "upload-length": String(file.size),
    "upload-metadata": `bucketName ${base("zayed-photos")},objectName ${base(path)},contentType ${base(contentType)}`,
    "x-upsert": "false",
  };
  const start = await fetch(`${api}/storage/v1/upload/resumable`, { method: "POST", headers });
  if (!start.ok) throw new Error(`Resumable upload setup failed (HTTP ${start.status})`);
  let location = start.headers.get("location");
  if (!location) throw new Error("Resumable upload returned no location");
  // The local storage service can return an old tunnel hostname. Keep every
  // chunk on the same public origin the visitor is already using.
  const locationUrl = new URL(location, api);
  location = `${api}${locationUrl.pathname}${locationUrl.search}`;
  const chunkSize = 50 * 1024 * 1024;
  for (let offset = 0; offset < file.size;) {
    const chunk = file.slice(offset, Math.min(offset + chunkSize, file.size));
    const part = await fetch(location, {
      method: "PATCH",
      headers: { apikey: supabaseSettings.publishableKey, authorization: `Bearer ${supabaseSettings.publishableKey}`, "tus-resumable": "1.0.0", "content-type": "application/offset+octet-stream", "upload-offset": String(offset) },
      body: chunk,
    });
    if (!part.ok) throw new Error(`Resumable upload failed (HTTP ${part.status})`);
    offset = Number(part.headers.get("upload-offset")) || offset + chunk.size;
  }
}

const scrollProgress = document.querySelector("#scrollProgress");
const scrollScenes = [...document.querySelectorAll(".hero, .gallery-section, .chat-section")];
let scrollFramePending = false;
function updateScrollProgress() {
  const root = document.documentElement;
  const available = root.scrollHeight - root.clientHeight;
  const progress = available > 0 ? Math.min(1, Math.max(0, root.scrollTop / available)) : 0;
  scrollProgress?.style.setProperty("transform", `scaleX(${progress})`);
  const viewportHeight = window.innerHeight || root.clientHeight;
  scrollScenes.forEach((scene) => {
    const rect = scene.getBoundingClientRect();
    const sceneProgress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (viewportHeight + rect.height)));
    const travel = sceneProgress - 0.5;
    scene.style.setProperty("--scene-progress", sceneProgress.toFixed(3));
    scene.style.setProperty("--scene-shift", `${(travel * 90).toFixed(1)}px`);
    scene.style.setProperty("--scene-counter-shift", `${(travel * -67.5).toFixed(1)}px`);
  });
  const heroProgress = Math.min(1, Math.max(0, root.scrollTop / Math.max(1, document.querySelector(".hero")?.offsetHeight || 1)));
  document.documentElement.style.setProperty("--hero-lift", `${(-heroProgress * 58).toFixed(1)}px`);
  document.documentElement.style.setProperty("--hero-copy-lift", `${(-heroProgress * 20).toFixed(1)}px`);
  document.documentElement.style.setProperty("--hero-art-shift", `${(heroProgress * 78).toFixed(1)}px`);
  document.documentElement.style.setProperty("--hero-fade", Math.max(0.22, 1 - heroProgress * 0.82).toFixed(3));
  scrollFramePending = false;
}
window.addEventListener("scroll", () => {
  if (scrollFramePending) return;
  scrollFramePending = true;
  requestAnimationFrame(updateScrollProgress);
}, { passive: true });
window.addEventListener("resize", updateScrollProgress, { passive: true });
updateScrollProgress();

const revealTargets = document.querySelectorAll(".section-heading, .gallery-note, .drop-hint, .storage-note, .chat-heading, .chat-layout, footer");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const hero = document.querySelector(".hero");
  let heroFrame = 0;
  hero?.addEventListener("pointermove", (event) => {
    if (heroFrame) return;
    const { clientX, clientY } = event;
    heroFrame = requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width * 2 - 1;
      const y = (clientY - rect.top) / rect.height * 2 - 1;
      hero.style.setProperty("--pointer-x", `${(x * 9).toFixed(1)}px`);
      hero.style.setProperty("--pointer-y", `${(y * 8).toFixed(1)}px`);
      hero.style.setProperty("--tilt-x", `${(x * 3).toFixed(1)}deg`);
      hero.style.setProperty("--tilt-y", `${(-y * 3).toFixed(1)}deg`);
      heroFrame = 0;
    });
  });
  hero?.addEventListener("pointerleave", () => {
    cancelAnimationFrame(heroFrame);
    heroFrame = 0;
    for (const name of ["--pointer-x", "--pointer-y", "--tilt-x", "--tilt-y"]) hero.style.removeProperty(name);
  });
  document.querySelectorAll(".add-button, .photo-picker-button, .submit-button, .request-button, .hero-link").forEach((button) => {
    let frame = 0;
    button.addEventListener("pointermove", (event) => {
      if (frame) return;
      const { clientX, clientY } = event;
      frame = requestAnimationFrame(() => {
        const rect = button.getBoundingClientRect();
        button.style.setProperty("--magnet-x", `${Math.max(-6, Math.min(6, (clientX - rect.left - rect.width / 2) * .12)).toFixed(1)}px`);
        button.style.setProperty("--magnet-y", `${Math.max(-6, Math.min(6, (clientY - rect.top - rect.height / 2) * .12)).toFixed(1)}px`);
        frame = 0;
      });
    });
    button.addEventListener("pointerleave", () => {
      cancelAnimationFrame(frame);
      frame = 0;
      button.style.removeProperty("--magnet-x");
      button.style.removeProperty("--magnet-y");
    });
  });
}
if (reduceMotion || !("IntersectionObserver" in window)) {
  revealTargets.forEach((element) => element.classList.add("scroll-reveal", "is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -8%" });
  revealTargets.forEach((element, index) => {
    element.classList.add("scroll-reveal");
    element.dataset.revealDelay = String(index % 3);
    revealObserver.observe(element);
  });
}

const cardRevealObserver = !reduceMotion && "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        cardRevealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6%" })
  : null;

function revealPhotoCards() {
  document.querySelectorAll(".photo-card:not(.card-reveal)").forEach((card, index) => {
    card.classList.add("card-reveal");
    card.dataset.cardSide = index % 2 ? "right" : "left";
    if (cardRevealObserver) cardRevealObserver.observe(card);
    else card.classList.add("is-visible");
  });
}

const pageSections = [...document.querySelectorAll("main section[id]")];
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll(".topbar nav a[href^='#']").forEach((link) => {
        link.classList.toggle("is-current", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-35% 0px -55%" });
  pageSections.forEach((pageSection) => sectionObserver.observe(pageSection));
}

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
    card.style.setProperty("--card-index", String(Math.min(index, 10)));
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
    if (photo.remoteId) {
      const preview = document.createElement("div");
      preview.className = "comments-preview";
      preview.textContent = tr("commentsEmpty");
      card.append(preview);
      loadCommentPreview(photo, preview);
      const comments = document.createElement("button");
      comments.type = "button";
      comments.className = "comments-button";
      comments.textContent = tr("commentsButton");
      comments.addEventListener("click", () => openComments(photo));
      const takedown = document.createElement("button");
      takedown.type = "button";
      takedown.className = "takedown-button";
      takedown.textContent = tr("takedownButton");
      takedown.addEventListener("click", () => openTakedown(photo));
      const actions = document.createElement("div");
      actions.className = "post-actions";
      actions.append(comments, takedown);
      card.append(actions);
    }
    grid.append(card);
  });
  revealPhotoCards();
}

const contributeDialog = document.querySelector("#contributeDialog");
const contributeForm = document.querySelector("#contributeForm");
const storageNote = document.querySelector("#storageNote");
const storageMessageKey = supabaseReady && supabaseClient ? "storageShared" : "storageLocal";
storageNote.textContent = tr(storageMessageKey);
document.querySelector("#addPhotos").addEventListener("click", () => contributeDialog.showModal());
const choosePhotosButton = document.querySelector("#choosePhotosButton");
const photoSelectionStatus = document.querySelector("#photoSelectionStatus");
const submitButton = contributeForm.querySelector(".submit-button");
let isSubmitting = false;
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
  if (isSubmitting) return;
  const uploader = document.querySelector("#submitterName").value.trim();
  const description = document.querySelector("#postDescription").value.trim();
  const files = [...input.files].filter((file) => file.type.startsWith("image/") || isVideoFile(file) || /\.(avif|bmp|gif|heic|heif|jpe?g|png|svg|tiff?|webp)$/i.test(file.name));
  const error = document.querySelector("#formError");
  if (!uploader) { error.textContent = tr("requiredName"); return; }
  if (!files.length) { error.textContent = tr("chooseImage"); return; }
  error.textContent = "";
  isSubmitting = true;
  submitButton.disabled = true;
  submitButton.textContent = tr("submitting");
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
          await uploadMedia(path, file, contentType);
          publicUrl = supabaseClient.storage.from("zayed-photos").getPublicUrl(path).data.publicUrl;
        }
        let { error: insertError } = await supabaseClient.from("photo_submissions").insert({ name: uploader, description, image_url: publicUrl, media_type: mediaType, approved: false });
        if (insertError && /description/i.test(insertError.message || "")) {
          ({ error: insertError } = await supabaseClient.from("photo_submissions").insert({ name: uploader, image_url: publicUrl, media_type: mediaType, approved: false }));
        }
        if (insertError) {
          if (cleanupSupabasePath) await supabaseClient.storage.from("zayed-photos").remove([cleanupSupabasePath]);
          throw insertError;
        }
        submitted++;
      } else {
        const photo = { id: crypto.randomUUID(), blob: file, mediaType, title, caption: description || "Freshly added to the collection.", tag: "NEW ARRIVAL", uploader, local: true };
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
  } finally {
    isSubmitting = false;
    submitButton.disabled = false;
    submitButton.textContent = tr("submitButton");
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

const commentsDialog = document.querySelector("#commentsDialog");
const commentsList = document.querySelector("#commentsList");
const commentsFor = document.querySelector("#commentsFor");
const commentsCount = document.querySelector("#commentsCount");
const commentForm = document.querySelector("#commentForm");
const takedownDialog = document.querySelector("#takedownDialog");
const takedownForm = document.querySelector("#takedownForm");
const reportDialog = document.querySelector("#reportDialog");
const reportForm = document.querySelector("#reportForm");
let activeCommentPhoto = null;
let activeTakedownPhoto = null;

async function loadCommentPreview(photo, element) {
  if (!supabaseClient || !photo.remoteId) return;
  const { data, error } = await supabaseClient.from("photo_comments").select("name,body,created_at").eq("photo_id", photo.remoteId).eq("status", "visible").order("created_at", { ascending: false }).limit(2);
  if (error || !data?.length) return;
  element.replaceChildren();
  const heading = document.createElement("span"); heading.className = "comments-preview-label"; heading.textContent = tr("commentsButton"); element.append(heading);
  for (const item of data.reverse()) { const line = document.createElement("p"); const name = document.createElement("strong"); name.textContent = `${item.name}: `; line.append(name, document.createTextNode(item.body)); element.append(line); }
}

function showComments(items) {
  commentsList.replaceChildren();
  commentsCount.textContent = `${items.length} ${items.length === 1 ? "COMMENT" : "COMMENTS"}`;
  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "comments-empty";
    empty.textContent = tr("commentsEmpty");
    commentsList.append(empty);
    return;
  }
  for (const item of items) {
    const entry = document.createElement("article");
    entry.className = "comment-entry";
    const meta = document.createElement("div");
    meta.className = "comment-meta";
    const avatar = document.createElement("span");
    avatar.className = "comment-avatar";
    avatar.textContent = Array.from(item.name || "?")[0].toUpperCase();
    const name = document.createElement("strong");
    name.textContent = item.name;
    const time = document.createElement("time");
    time.dateTime = item.created_at;
    time.textContent = new Intl.DateTimeFormat(currentLanguage === "ar" ? "ar-AE" : "en-AE", { hour: "numeric", minute: "2-digit", day: "numeric", month: "short" }).format(new Date(item.created_at));
    meta.append(avatar, name, time);
    const body = document.createElement("p");
    body.textContent = item.body;
    entry.append(meta, body);
    commentsList.append(entry);
  }
}

async function openComments(photo) {
  activeCommentPhoto = photo;
  commentsFor.textContent = photo.title;
  document.querySelector("#commentError").textContent = "";
  commentsList.textContent = "…";
  commentsDialog.showModal();
  if (!supabaseClient) { commentsList.textContent = tr("commentsUnavailable"); return; }
  const { data, error } = await supabaseClient.from("photo_comments")
    .select("id,name,body,created_at").eq("photo_id", photo.remoteId).eq("status", "visible")
    .order("created_at", { ascending: true });
  if (error) { commentsList.textContent = tr("commentsUnavailable"); return; }
  showComments(data || []);
}

document.querySelector("#commentsClose").addEventListener("click", () => commentsDialog.close());
commentsDialog.addEventListener("click", (event) => { if (event.target === commentsDialog) commentsDialog.close(); });
function openTakedown(photo) {
  activeTakedownPhoto = photo;
  document.querySelector("#takedownFor").textContent = photo.title;
  document.querySelector("#takedownError").textContent = "";
  takedownDialog.showModal();
}
document.querySelector("#takedownClose").addEventListener("click", () => takedownDialog.close());
takedownDialog.addEventListener("click", (event) => { if (event.target === takedownDialog) takedownDialog.close(); });
document.querySelector("#reportOpen").addEventListener("click", () => { document.querySelector("#reportError").textContent = ""; reportDialog.showModal(); });
document.querySelector("#reportClose").addEventListener("click", () => reportDialog.close());
reportDialog.addEventListener("click", (event) => { if (event.target === reportDialog) reportDialog.close(); });
commentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const error = document.querySelector("#commentError");
  const name = document.querySelector("#commentName").value.trim();
  const body = document.querySelector("#commentBody").value.trim();
  if (!activeCommentPhoto || !name || !body) { error.textContent = tr("commentRequired"); return; }
  const button = document.querySelector("#commentSubmit");
  error.textContent = ""; button.disabled = true; button.textContent = tr("commentPosting");
  const { data: insertedComment, error: insertError } = await supabaseClient.from("photo_comments").insert({ photo_id: activeCommentPhoto.remoteId, name, body }).select("id").single();
  button.disabled = false; button.textContent = tr("commentSubmit");
  if (insertError) { error.textContent = tr("commentFailed"); return; }
  commentForm.reset(); error.textContent = tr("commentPosted");
  if (insertedComment?.id) fetch(`${supabaseSettings.url.replace(/\/$/, "")}/functions/v1/dynamic-function/comment-notify`, { method: "POST", headers: { apikey: supabaseSettings.publishableKey, authorization: `Bearer ${supabaseSettings.publishableKey}`, "content-type": "application/json" }, body: JSON.stringify({ commentId: insertedComment.id }) }).catch(() => {});
  openComments(activeCommentPhoto);
});
takedownForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const error = document.querySelector("#takedownError");
  const name = document.querySelector("#takedownName").value.trim();
  const reason = document.querySelector("#takedownReason").value.trim();
  if (!activeTakedownPhoto || !name || !reason) { error.textContent = tr("takedownRequired"); return; }
  const button = document.querySelector("#takedownSubmit");
  error.textContent = ""; button.disabled = true; button.textContent = tr("takedownSending");
  const { error: requestError } = await supabaseClient.from("photo_takedown_requests").insert({ photo_id: activeTakedownPhoto.remoteId, name, reason });
  button.disabled = false; button.textContent = tr("takedownSubmit");
  if (requestError) { error.textContent = tr("takedownFailed"); return; }
  fetch(`${supabaseSettings.url.replace(/\/$/, "")}/functions/v1/dynamic-function/takedown-notify`, { method: "POST", headers: { apikey: supabaseSettings.publishableKey, authorization: `Bearer ${supabaseSettings.publishableKey}`, "content-type": "application/json" }, body: JSON.stringify({ photoId: activeTakedownPhoto.remoteId, name, reason }) }).catch(() => {});
  takedownForm.reset(); error.textContent = tr("takedownSent");
});
reportForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const error = document.querySelector("#reportError");
  const name = document.querySelector("#reportName").value.trim();
  const report = document.querySelector("#reportBody").value.trim();
  if (!report) { error.textContent = tr("reportRequired"); return; }
  const button = document.querySelector("#reportSubmit");
  error.textContent = ""; button.disabled = true; button.textContent = tr("reportSending");
  const { error: reportError } = await supabaseClient.from("site_reports").insert({ name: name || "Anonymous", body: report });
  button.disabled = false; button.textContent = tr("reportSubmit");
  if (reportError) { error.textContent = tr("reportFailed"); return; }
  fetch(`${supabaseSettings.url.replace(/\/$/, "")}/functions/v1/dynamic-function/report-notify`, { method: "POST", headers: { apikey: supabaseSettings.publishableKey, authorization: `Bearer ${supabaseSettings.publishableKey}`, "content-type": "application/json" }, body: JSON.stringify({ name, report }) }).catch(() => {});
  reportForm.reset(); error.textContent = tr("reportSent");
});

const chatMessagesElement = document.querySelector("#chatMessages");
const chatForm = document.querySelector("#chatForm");
const chatName = document.querySelector("#chatName");
const chatBody = document.querySelector("#chatBody");
const chatError = document.querySelector("#chatError");
const chatSubmit = document.querySelector("#chatSubmit");
const chatClientStorageKey = "ensmbz-chat-client-id";
const chatNameStorageKey = "ensmbz-chat-name";
const chatClientId = (() => {
  const saved = localStorage.getItem(chatClientStorageKey);
  if (saved) return saved;
  const created = globalThis.crypto?.randomUUID?.() || `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  localStorage.setItem(chatClientStorageKey, created);
  return created;
})();
const savedChatName = localStorage.getItem(chatNameStorageKey) || "";
if (chatName && savedChatName) chatName.value = savedChatName;
let roomMessages = [];
let chatIdentityRole = "guest";

async function refreshChatIdentity() {
  if (!supabaseClient) return;
  const { data: { session } } = await supabaseClient.auth.getSession();
  const email = session?.user?.email?.toLowerCase();
  if (!email) return;
  const { data: owner } = await supabaseClient.rpc("is_site_owner");
  if (owner) chatIdentityRole = "owner";
  else {
    const { data: staff } = await supabaseClient.from("staff_permissions").select("username").eq("email", email).maybeSingle();
    if (staff) chatIdentityRole = "staff";
  }
  if (chatIdentityRole !== "guest" && chatName) {
    chatName.value = chatIdentityRole === "owner" ? "Owner" : "Staff";
    chatName.readOnly = true;
    chatName.setAttribute("aria-label", `${chatName.value} chat identity`);
  }
}

function isOwnChatMessage(item) {
  if (item.client_id) return item.client_id === chatClientId;
  const rememberedName = chatName?.value.trim() || savedChatName;
  return Boolean(rememberedName && item.name === rememberedName);
}

function renderChatMessages({ scroll = false } = {}) {
  if (!chatMessagesElement) return;
  chatMessagesElement.replaceChildren();
  if (!roomMessages.length) {
    const empty = document.createElement("p");
    empty.className = "chat-empty";
    empty.textContent = tr("chatEmpty");
    chatMessagesElement.append(empty);
    return;
  }
  const timeFormatter = new Intl.DateTimeFormat(currentLanguage === "ar" ? "ar-AE" : "en-AE", { hour: "numeric", minute: "2-digit" });
  for (const item of roomMessages) {
    const message = document.createElement("article");
    message.className = "chat-message";
    const isOwn = isOwnChatMessage(item);
    if (isOwn) message.classList.add("is-own");
    message.dataset.initial = Array.from(item.name || "?")[0]?.toUpperCase() || "?";
    const head = document.createElement("div");
    head.className = "chat-message-head";
    const identity = document.createElement("div");
    identity.className = "chat-message-identity";
    const name = document.createElement("strong");
    name.textContent = item.name;
    identity.append(name);
    if (item.sender_role === "owner" || item.sender_role === "staff") {
      const roleBadge = document.createElement("span");
      roleBadge.className = `chat-role-badge is-${item.sender_role}`;
      roleBadge.textContent = item.sender_role === "owner" ? "OWNER" : "STAFF";
      identity.append(roleBadge);
    }
    if (isOwn) {
      const youBadge = document.createElement("span");
      youBadge.className = "chat-you-badge";
      youBadge.textContent = tr("chatYou");
      identity.append(youBadge);
    }
    const time = document.createElement("time");
    time.dateTime = item.created_at;
    time.textContent = timeFormatter.format(new Date(item.created_at));
    const body = document.createElement("p");
    body.textContent = item.body;
    head.append(identity, time);
    message.append(head, body);
    chatMessagesElement.append(message);
  }
  if (scroll) chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
}

async function loadChatRoom() {
  if (!chatMessagesElement) return;
  if (!supabaseClient) { chatMessagesElement.textContent = tr("chatUnavailable"); return; }
  const { data, error } = await supabaseClient.from("chat_messages")
    .select("id,name,body,created_at,client_id,sender_role")
    .order("created_at", { ascending: false })
    .limit(80);
  if (error) { chatMessagesElement.textContent = tr("chatUnavailable"); return; }
  roomMessages = (data || []).reverse();
  renderChatMessages({ scroll: true });
}

chatForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabaseClient) { chatError.textContent = tr("chatUnavailable"); return; }
  const name = chatIdentityRole === "owner" ? "Owner" : chatIdentityRole === "staff" ? "Staff" : (chatName.value.trim() || (currentLanguage === "ar" ? "زائر" : "Guest"));
  const body = chatBody.value.trim();
  if (!body) { chatError.textContent = tr("chatRequired"); return; }
  chatError.textContent = "";
  chatSubmit.disabled = true;
  chatSubmit.textContent = tr("chatSending");
  localStorage.setItem(chatNameStorageKey, chatName.value.trim());
  const { data, error } = await supabaseClient.from("chat_messages").insert({ name, body, client_id: chatClientId }).select("id,name,body,created_at,client_id,sender_role").single();
  chatSubmit.disabled = false;
  chatSubmit.textContent = tr("chatSubmit");
  if (error) { chatError.textContent = tr("chatFailed"); return; }
  chatBody.value = "";
  if (data && !roomMessages.some((item) => item.id === data.id)) {
    roomMessages.push(data);
    roomMessages = roomMessages.slice(-80);
    renderChatMessages({ scroll: true });
  }
  chatError.textContent = tr("chatSent");
});

chatName?.addEventListener("input", () => {
  localStorage.setItem(chatNameStorageKey, chatName.value.trim());
  renderChatMessages();
});

if (supabaseClient) {
  refreshChatIdentity();
  supabaseClient.auth.onAuthStateChange(() => { refreshChatIdentity(); });
  supabaseClient.channel("ensmbz-chat-room")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, ({ new: message }) => {
      if (!message?.id || roomMessages.some((item) => item.id === message.id)) return;
      roomMessages.push(message);
      roomMessages = roomMessages.slice(-80);
      renderChatMessages({ scroll: true });
    })
    .on("postgres_changes", { event: "DELETE", schema: "public", table: "chat_messages" }, ({ old: message }) => {
      if (!message?.id) return;
      roomMessages = roomMessages.filter((item) => item.id !== message.id);
      renderChatMessages();
    })
    .subscribe();
}
loadChatRoom();

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
  storageNote.textContent = tr(storageMessageKey);
  try { localStorage.setItem("ensmbz-language", currentLanguage); } catch { /* Language still changes for this page view. */ }
  render();
  renderChatMessages();
}
for (const button of document.querySelectorAll("[data-language-toggle]")) {
  button.addEventListener("click", () => {
    applyLanguage(currentLanguage === "ar" ? "en" : "ar");
  });
}
applyLanguage();
const languageDialog = document.querySelector("#languageDialog");
for (const button of document.querySelectorAll("[data-language-choice]")) {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.languageChoice);
    try { localStorage.setItem("ensmbz-language-chosen", "true"); } catch { /* Choice is still used for this page view. */ }
    languageDialog.close();
  });
}
try { if (!localStorage.getItem("ensmbz-language-chosen")) languageDialog.showModal(); } catch { languageDialog.showModal(); }

async function loadSharedPhotos() {
  if (!supabaseReady || !supabaseClient) return;
  const { data, error } = await supabaseClient.from("photo_submissions")
    .select("id,name,description,image_url,media_type,created_at")
    .eq("approved", true)
    .order("created_at", { ascending: false });
  if (error) {
    storageNote.textContent = tr("galleryLoadFailed");
    return;
  }
  sharedPhotos = (data || []).map((row) => ({
    id: `shared-${row.id}`, remoteId: row.id, src: row.image_url, mediaType: row.media_type || "image", title: "A community masterpiece",
    caption: row.description || "Freshly added to the collection.", tag: "COMMUNITY", uploader: row.name
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
const siteControlUrl = `${supabaseSettings.url}/rest/v1/site_control?select=is_live,panic_mode&id=eq.true`;
async function refreshSiteStatus() {
  try {
    const response = await fetch(siteControlUrl, { cache: "no-store", headers: { apikey: supabaseSettings.publishableKey, authorization: `Bearer ${supabaseSettings.publishableKey}` } });
    if (!response.ok) return;
    const [status] = await response.json();
    if (!status) return;
    const mode = status.panic_mode ? "panic" : status.is_live === false ? "paused" : "live";
    document.querySelectorAll("#sitePaused [data-site-state]").forEach((panel) => { panel.hidden = panel.dataset.siteState !== mode; });
    sitePaused.hidden = mode === "live";
    document.body.classList.toggle("is-site-paused", mode !== "live");
    document.body.classList.toggle("is-site-panic", mode === "panic");
  } catch {
    // Keep the site available if Supabase is temporarily unreachable.
  }
}
refreshSiteStatus();
window.setInterval(refreshSiteStatus, 20000);
