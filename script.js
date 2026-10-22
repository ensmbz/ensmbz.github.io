const translations = {
  en: {
    pauseEyebrow: "THE EXHIBITION IS RESTING", pauseTitle: 'TAKING A<br>BREAK<span class="period">.</span>', panicMessage: "YOU CAN'T FIND ME.",
    pausedMessage: "The collection is temporarily closed. The frames are staying put and the archive will return soon.",
    ticker: "★ THE ENS MBZ FILES ★ VERY IMPORTANT GOOFINESS ★ THINKING OPTIONAL ★ NO CONTEXT REQUIRED ★ THE ENS MBZ FILES ★ VERY IMPORTANT GOOFINESS ★ THINKING OPTIONAL ★ NO CONTEXT REQUIRED ★",
    navGallery: "THE GALLERY", navChat: "CHAT ROOM", navReport: "REPORT", navAbout: "ABOUT",
    heroEyebrow: "ENS MBZ ARCHIVE · CURRENT EXHIBITION", heroTitle: 'THE<br><span class="headline-last">ARCHIVE</span><br>STAYS LOUD<span class="period">.</span>',
    heroDescription: "An unofficial exhibition of school memories, unexpected portraits, and moments too good to leave in the camera roll.",
    tourLink: "TAKE THE TOUR", scribbleOne: "brain cell<br>loading...", scribbleTwo: "← swipe<br>for evidence",
    scrollExhibition: "SCROLL FOR THE EXHIBITION", figureLabel: "FIG. 001 — ∞", collection: "THE PERMANENT COLLECTION",
    galleryTitle: 'THE GALLERY<span class="period">.</span>', addPhotos: "ADD PHOTOS OR VIDEOS", galleryNote: "Museum rule #1: there are no bad angles, only interesting evidence.",
    dropHint: 'Got more? Drop photos or videos anywhere in the gallery or tap “Add your photos”.', formEyebrow: "ADD TO THE ENS MBZ ARCHIVE", formTitle: 'SUBMIT MEDIA<span class="period">.</span>',
    nameLabel: 'YOUR NAME <span>(required)</span>', namePlaceholder: "Who is submitting this?", filesLabel: 'PHOTOS OR VIDEOS <span>(required · photos up to 20 MB, videos up to 50 MB)</span>',
    descriptionLabel: 'DESCRIPTION <span>(optional)</span>', descriptionPlaceholder: "Tell people about this post",
    chooseMedia: "CHOOSE PHOTOS OR VIDEOS", noMediaSelected: "No media selected", mediaSelected: "item selected", mediaSelectedMany: "items selected",
    formHelp: "Your name will appear next to the photos or videos. MP4 works best; use the video controls to hear its audio. Submissions appear after approval.",
    submitButton: "ADD TO THE GALLERY ↗", submitting: "ADDING…", close: "Close", storageShared: "Photos and videos are submitted to the shared gallery and appear after ENS MBZ approves them.",
    storageLocal: "Shared uploads are not connected yet. Media you add is saved in this browser on this device.",
    objectOne: "OBJECT", objectMany: "OBJECTS", emptyGallery: "THE GALLERY IS TAKING A NAP. ADD A PHOTO TO WAKE IT UP.",
    number: "NO.", addedBy: "Added by", newArrival: "NEW ARRIVAL", expand: "Expand", remove: "Remove",
    requiredName: "Please enter your name before submitting.", chooseImage: "Please choose at least one photo or video.", sizeLimit: "Photos must be up to 20 MB and videos up to 50 MB.",
    photosSubmitted: "items submitted", photoSubmitted: "item submitted", afterApproval: "New photos and videos join the shared gallery after approval.",
    uploadFailed: "Upload failed", checkBucket: "check the Supabase bucket size limit and policies, then try again.", localSaveFailed: "This browser couldn't save the media. Try a smaller file or another browser.",
    galleryLoadFailed: "The shared gallery could not load. Check the Supabase table and access policies.",
    quipButton: "ROAST HIM AGAIN ↻", initialQuip: "THE CURATOR WOULD LIKE YOU TO KNOW: ENS MBZ IS A CERTIFIED GOOFBALL.",
    footerNote: "A SMALL INTERNET MUSEUM. ONE LARGE GOOFBALL.", backTop: "BACK TO TOP ↑", languageButton: "العربية",
    commentsButton: "COMMENTS", takedownButton: "REQUEST TAKEDOWN", commentsEyebrow: "THE CONVERSATION", commentsTitle: 'COMMENTS<span class="period">.</span>', commentsEmpty: "No comments yet. Start the conversation.", commentsUnavailable: "Comments are unavailable right now.", commentNameLabel: "YOUR NAME", commentLabel: "COMMENT", commentPlaceholder: "Keep it nice.", commentSubmit: "POST COMMENT", commentPosting: "POSTING…", commentRequired: "Please enter your name and a comment.", commentPosted: "Your comment was posted.", commentFailed: "Your comment could not be posted. Please try again.", takedownEyebrow: "POST SAFETY", takedownTitle: 'REQUEST TAKEDOWN<span class="period">.</span>', takedownIntro: "Tell the moderators why this post should be removed. Your request is private.", takedownReasonLabel: "WHY SHOULD IT BE REMOVED?", takedownPlaceholder: "Tell the moderators why.", takedownSubmit: "SEND REQUEST", takedownSending: "SENDING…", takedownRequired: "Please enter your name and a reason.", takedownSent: "Your request was sent to the moderators.", takedownFailed: "Your request could not be sent. Please try again.", reportEyebrow: "PRIVATE MODERATION", reportTitle: 'SEND A REPORT<span class="period">.</span>', reportIntro: "Tell the moderators what happened. Your report is private and does not appear in the chat room.", reportNameLabel: "YOUR NAME <span>(OPTIONAL)</span>", reportNamePlaceholder: "Leave blank to stay anonymous", reportBodyLabel: "WHAT DO YOU WANT TO REPORT?", reportBodyPlaceholder: "Give the moderators the details.", reportSubmit: "SEND REPORT", reportSending: "SENDING…", reportRequired: "Please describe what you want to report.", reportSent: "Your report was sent to the moderators.", reportFailed: "Your report could not be sent. Please try again.",
    chatEyebrow: "THE VISITOR BOOK", chatTitle: 'CHAT ROOM<span class="period">.</span>', chatLive: "LIVE ROOM", chatLoading: "Opening the room…", chatEmpty: "The room is quiet. Be the first to say something.", chatUnavailable: "The chat room is unavailable right now.", chatJoin: "JOIN THE CONVERSATION", chatNameLabel: "NAME (OPTIONAL)", chatNamePlaceholder: "Leave blank to post as Guest", chatMessageLabel: "MESSAGE", chatPlaceholder: "Say something to the room…", chatSubmit: "SEND MESSAGE ↗", chatSending: "SENDING…", chatRequired: "Please enter a message.", chatSent: "Message sent.", chatFailed: "Your message could not be sent. Try again.", chatNote: "Be kind. Messages are public.", chatYou: "YOU", musicPlay: "PLAY AMBIENCE", musicStop: "STOP MUSIC",
  },
  ar: {
    pauseEyebrow: "المعرض يستريح الآن", pauseTitle: 'نأخذ<br>استراحة<span class="period">.</span>', panicMessage: "لا يتم العثور على الموقع",
    pausedMessage: "المجموعة مغلقة مؤقتاً. ستبقى الإطارات في مكانها وسيعود الأرشيف قريباً.",
    ticker: "★ ملفات المدرسة الإماراتية في مدينة زايد ★ عبث مهم جداً ★ التفكير اختياري ★ لا حاجة للسياق ★ ملفات المدرسة الإماراتية في مدينة زايد ★ عبث مهم جداً ★ التفكير اختياري ★ لا حاجة للسياق ★",
    navGallery: "المعرض", navChat: "غرفة الدردشة", navReport: "إبلاغ", navAbout: "عن الموقع",
    heroEyebrow: "أرشيف ENS MBZ · المعرض الحالي", heroTitle: 'الأرشيف<br><span class="headline-last">يبقى</span><br>صاخباً<span class="period">.</span>',
    heroDescription: "معرض غير رسمي لذكريات المدرسة وصور غير متوقعة ولحظات أجمل من أن تبقى في ألبوم الكاميرا.",
    tourLink: "ابدأ الجولة", scribbleOne: "خلية دماغية<br>جارٍ التحميل...", scribbleTwo: "← اسحب<br>لرؤية الأدلة",
    scrollExhibition: "مرّر لاستكشاف المعرض", figureLabel: "الصورة ٠٠١ — ∞", collection: "المجموعة الدائمة",
    galleryTitle: 'المعرض<span class="period">.</span>', addPhotos: "أضف صوراً أو فيديو", galleryNote: "قاعدة المتحف الأولى: لا توجد زوايا سيئة، بل أدلة مثيرة للاهتمام.",
    dropHint: 'هل لديك المزيد؟ أفلِت الصور أو الفيديوهات في أي مكان بالمعرض أو اضغط «أضف صورك».', formEyebrow: "أضف إلى أرشيف ENS MBZ", formTitle: 'أرسل صوراً أو فيديو<span class="period">.</span>',
    nameLabel: 'اسمك <span>(مطلوب)</span>', namePlaceholder: "من يرسل الصور أو الفيديو؟", filesLabel: 'صور أو فيديوهات <span>(مطلوب · الصور حتى ٢٠ م.ب. والفيديو حتى ٥٠ م.ب.)</span>',
    descriptionLabel: 'الوصف <span>(اختياري)</span>', descriptionPlaceholder: "أخبر الناس عن هذه المشاركة",
    chooseMedia: "اختر صوراً أو فيديوهات", noMediaSelected: "لم يتم اختيار ملفات", mediaSelected: "ملف تم اختياره", mediaSelectedMany: "ملفات تم اختيارها",
    formHelp: "سيظهر اسمك بجانب الصور أو الفيديوهات. صيغة MP4 هي الأفضل؛ استخدم أدوات الفيديو لتشغيل الصوت. تظهر المشاركات بعد الموافقة.",
    submitButton: "أضف إلى المعرض ↗", submitting: "جارٍ الإضافة…", close: "إغلاق", storageShared: "تُرسل الصور والفيديوهات إلى المعرض المشترك وتظهر بعد موافقة ENS MBZ عليها.",
    storageLocal: "الرفع المشترك غير متصل حالياً. تُحفظ الوسائط التي تضيفها في هذا المتصفح على هذا الجهاز.",
    objectOne: "صورة", objectMany: "صور", emptyGallery: "المعرض يأخذ قيلولة. أضف صورة لإيقاظه.",
    number: "رقم", addedBy: "أضافها", newArrival: "إضافة جديدة", expand: "تكبير", remove: "إزالة",
    requiredName: "يرجى كتابة اسمك قبل الإرسال.", chooseImage: "يرجى اختيار صورة أو فيديو واحد على الأقل.", sizeLimit: "يجب ألا يتجاوز حجم الصورة ٢٠ م.ب. والفيديو ٥٠ م.ب.",
    photosSubmitted: "ملفات تم إرسالها", photoSubmitted: "ملف تم إرساله", afterApproval: "تُضاف الصور والفيديوهات الجديدة إلى المعرض المشترك بعد الموافقة عليها.",
    uploadFailed: "تعذّر رفع الملف", checkBucket: "تحقق من حد حجم الملفات في Supabase وسياسات التخزين ثم حاول مجدداً.", localSaveFailed: "تعذّر حفظ الوسائط في هذا المتصفح. جرّب ملفاً أصغر أو متصفحاً آخر.",
    galleryLoadFailed: "تعذّر تحميل المعرض المشترك. تحقق من جدول Supabase وسياسات الوصول.",
    quipButton: "أطلق مزحة أخرى ↻", initialQuip: "يرجى العلم: ENS MBZ مشاغب معتمد.",
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

const scrollProgress = document.querySelector("#scrollProgress");
let scrollFramePending = false;
function updateScrollProgress() {
  const root = document.documentElement;
  const available = root.scrollHeight - root.clientHeight;
  const progress = available > 0 ? Math.min(1, Math.max(0, root.scrollTop / available)) : 0;
  scrollProgress?.style.setProperty("transform", `scaleX(${progress})`);
  scrollFramePending = false;
}
window.addEventListener("scroll", () => {
  if (scrollFramePending) return;
  scrollFramePending = true;
  requestAnimationFrame(updateScrollProgress);
}, { passive: true });
window.addEventListener("resize", updateScrollProgress, { passive: true });
updateScrollProgress();

const revealTargets = document.querySelectorAll(".section-heading, .gallery-note, .drop-hint, .storage-note, .chat-heading, .chat-layout, .about-strip, footer");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

const musicToggle = document.querySelector("#musicToggle");
let musicContext = null;
let musicMaster = null;
let musicTimer = null;
let musicPlaying = false;
let musicPhrase = 0;

function updateMusicButton() {
  if (!musicToggle) return;
  musicToggle.setAttribute("aria-pressed", String(musicPlaying));
  musicToggle.querySelector("[data-music-label]").textContent = tr(musicPlaying ? "musicStop" : "musicPlay");
  musicToggle.title = tr(musicPlaying ? "musicStop" : "musicPlay");
}

function ambientTone(frequency, start, duration, volume, pan = 0) {
  if (!musicContext || !musicMaster) return;
  const oscillator = musicContext.createOscillator();
  const shimmer = musicContext.createOscillator();
  const envelope = musicContext.createGain();
  const filter = musicContext.createBiquadFilter();
  const panner = typeof musicContext.createStereoPanner === "function" ? musicContext.createStereoPanner() : null;
  oscillator.type = "sine";
  shimmer.type = "triangle";
  oscillator.frequency.value = frequency;
  shimmer.frequency.value = frequency * 2;
  shimmer.detune.value = 7;
  filter.type = "lowpass";
  filter.frequency.value = 1250;
  filter.Q.value = 0.45;
  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(volume, start + Math.min(1.4, duration * 0.28));
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  if (panner) panner.pan.value = pan;
  oscillator.connect(filter);
  shimmer.connect(filter);
  filter.connect(envelope);
  envelope.connect(panner || musicMaster);
  if (panner) panner.connect(musicMaster);
  oscillator.start(start);
  shimmer.start(start);
  oscillator.stop(start + duration + 0.1);
  shimmer.stop(start + duration + 0.1);
}

function scheduleAmbientPhrase() {
  if (!musicPlaying || !musicContext) return;
  const start = musicContext.currentTime + 0.08;
  const phrases = [
    [220, 261.63, 329.63, 392],
    [196, 246.94, 293.66, 369.99],
    [174.61, 220, 261.63, 329.63],
  ];
  const notes = phrases[musicPhrase % phrases.length];
  musicPhrase++;
  ambientTone(notes[0] / 2, start, 13.5, 0.035, -0.12);
  notes.forEach((frequency, index) => ambientTone(frequency, start + index * 2.7, 5.6, 0.024, index % 2 ? 0.35 : -0.35));
}

async function startAmbientMusic() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  if (!musicContext) {
    musicContext = new AudioContextClass();
    musicMaster = musicContext.createGain();
    musicMaster.gain.value = 0.58;
    musicMaster.connect(musicContext.destination);
  }
  await musicContext.resume();
  musicPlaying = true;
  scheduleAmbientPhrase();
  musicTimer = window.setInterval(scheduleAmbientPhrase, 10800);
  updateMusicButton();
}

function stopAmbientMusic() {
  musicPlaying = false;
  if (musicTimer) window.clearInterval(musicTimer);
  musicTimer = null;
  if (musicMaster && musicContext) {
    musicMaster.gain.cancelScheduledValues(musicContext.currentTime);
    musicMaster.gain.setTargetAtTime(0.0001, musicContext.currentTime, 0.25);
  }
  updateMusicButton();
}

musicToggle?.addEventListener("click", async () => {
  if (musicPlaying) stopAmbientMusic();
  else {
    if (musicMaster && musicContext) musicMaster.gain.setTargetAtTime(0.58, musicContext.currentTime, 0.2);
    await startAmbientMusic();
  }
});
updateMusicButton();
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
  if (files.some((file) => file.size > (isVideoFile(file) ? 50 : 20) * 1024 * 1024)) { error.textContent = tr("sizeLimit"); return; }
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
          const { error: uploadError } = await supabaseClient.storage.from("zayed-photos").upload(path, file, { upsert: false, contentType });
          if (uploadError) throw uploadError;
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
  let requestError = null;
  try {
    const response = await fetch(`${supabaseSettings.url.replace(/\/$/, "")}/functions/v1/dynamic-function/takedown-notify`, {
      method: "POST",
      headers: { apikey: supabaseSettings.publishableKey, authorization: `Bearer ${supabaseSettings.publishableKey}`, "content-type": "application/json" },
      body: JSON.stringify({ photoId: activeTakedownPhoto.remoteId, name, reason }),
    });
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      requestError = new Error(result.error || "Request failed");
    }
  } catch (networkError) { requestError = networkError; }
  button.disabled = false; button.textContent = tr("takedownSubmit");
  if (requestError) { error.textContent = tr("takedownFailed"); return; }
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
  let reportError = null;
  try {
    const response = await fetch(`${supabaseSettings.url.replace(/\/$/, "")}/functions/v1/dynamic-function/report-notify`, {
      method: "POST",
      headers: { apikey: supabaseSettings.publishableKey, authorization: `Bearer ${supabaseSettings.publishableKey}`, "content-type": "application/json" },
      body: JSON.stringify({ name, report }),
    });
    if (!response.ok) { const result = await response.json().catch(() => ({})); reportError = new Error(result.error || "Report failed"); }
  } catch (networkError) { reportError = networkError; }
  button.disabled = false; button.textContent = tr("reportSubmit");
  if (reportError) { error.textContent = tr("reportFailed"); return; }
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
    .select("id,name,body,created_at,client_id")
    .order("created_at", { ascending: false })
    .limit(80);
  if (error) { chatMessagesElement.textContent = tr("chatUnavailable"); return; }
  roomMessages = (data || []).reverse();
  renderChatMessages({ scroll: true });
}

chatForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabaseClient) { chatError.textContent = tr("chatUnavailable"); return; }
  const name = chatName.value.trim() || (currentLanguage === "ar" ? "زائر" : "Guest");
  const body = chatBody.value.trim();
  if (!body) { chatError.textContent = tr("chatRequired"); return; }
  chatError.textContent = "";
  chatSubmit.disabled = true;
  chatSubmit.textContent = tr("chatSending");
  localStorage.setItem(chatNameStorageKey, chatName.value.trim());
  const { data, error } = await supabaseClient.from("chat_messages").insert({ name, body, client_id: chatClientId }).select("id,name,body,created_at,client_id").single();
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
  updateMusicButton();
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
const siteControlUrl = `${supabaseSettings.url || "https://vuxenevtawplaklregbz.supabase.co"}/functions/v1/dynamic-function/site-control`;
async function refreshSiteStatus() {
  try {
    const response = await fetch(siteControlUrl, { cache: "no-store" });
    if (!response.ok) return;
    const status = await response.json();
    const paused = status.is_live === false;
    const panicMessage = document.querySelector("#sitePaused [data-i18n='panicMessage']");
    if (panicMessage) panicMessage.textContent = tr("panicMessage");
    sitePaused.hidden = !paused;
    document.body.classList.toggle("is-site-paused", paused);
    if (paused && musicPlaying) stopAmbientMusic();
  } catch {
    // Keep the site available if Supabase is temporarily unreachable.
  }
}
refreshSiteStatus();
window.setInterval(refreshSiteStatus, 20000);
