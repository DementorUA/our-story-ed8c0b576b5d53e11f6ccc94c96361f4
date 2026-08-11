
const DEFAULT_STORY_TEXTS = {
  titles: [
    "Тот самый свет",
    "Смеяться вместе",
    "Наш маленький мир"
  ],
  notes: [
    "Это мгновение осталось тихим доказательством того, что счастье умеет быть очень простым.",
    "Иногда один кадр хранит больше тепла, чем длинное письмо.",
    "Здесь нет ничего лишнего - только свет, воздух и чувство, к которому хочется возвращаться."
  ]
};
let storyTexts = DEFAULT_STORY_TEXTS;

function cleanTextDeck(value, fallback) {
  const deck = Array.isArray(value)
    ? value.map(item => String(item || "").trim()).filter(Boolean)
    : [];
  return deck.length ? deck : fallback;
}

async function loadStoryTexts() {
  try {
    const response = await fetch("assets/data/story-texts.json", { cache: "no-store" });
    if (!response.ok) throw new Error("STORY_TEXTS_NOT_FOUND");
    const data = await response.json();
    storyTexts = {
      titles: cleanTextDeck(data.titles || data.captions, DEFAULT_STORY_TEXTS.titles),
      notes: cleanTextDeck(data.notes || data.storyNotes, DEFAULT_STORY_TEXTS.notes)
    };
  } catch (error) {
    console.warn("Using built-in story texts", error);
    storyTexts = DEFAULT_STORY_TEXTS;
  }
}


let photos = [];
let currentIndex = 0;
let effectsEnabled = true;
let soundOn = false;
let navAudioContext = null;
let lightboxAnimating = false;
let lightboxTouchDx = 0;
let lightboxTouchDy = 0;
let lightboxTouchDragging = false;
let derivedKey = null;
let albumMeta = null;
const decryptedUrls = [];
const photoUrlCache = new Map();
const photoUrlPromises = new Map();
const decryptQueue = [];
let activeDecrypts = 0;
const MAX_ACTIVE_DECRYPTS = 3;
const REMEMBER_DB = "our-story-device-key";
const REMEMBER_STORE = "trusted-device";
const REMEMBER_KEY = "album-key";

const els = {
  featured: document.getElementById("featuredStory"),
  gallery: document.getElementById("galleryGrid"),
  collage: document.getElementById("finaleCollage"),
  photoCount: document.getElementById("photoCount"),
  favoriteCount: document.getElementById("favoriteCount"),
  heroSubtitle: document.getElementById("heroSubtitle"),
  lightbox: document.getElementById("lightbox"),
  lightboxImageWrap: document.querySelector(".lightbox-image-wrap"),
  lightboxImage: document.getElementById("lightboxImage"),
  lightboxImageNext: document.getElementById("lightboxImageNext"),
  lightboxCaption: document.getElementById("lightboxCaption"),
  lightboxCounter: document.getElementById("lightboxCounter"),
  audio: document.getElementById("backgroundAudio"),
  soundToggle: document.getElementById("soundToggle"),
  effectsToggle: document.getElementById("effectsToggle"),
  lockScreen: document.getElementById("lockScreen"),
  unlockForm: document.getElementById("unlockForm"),
  passwordInput: document.getElementById("passwordInput"),
  rememberDevice: document.getElementById("rememberDeviceInput"),
  lockStatus: document.getElementById("lockStatus")
};

async function setupAudioControl() {
  const source = els.audio?.querySelector("source");
  if (!source || !source.getAttribute("src")) {
    els.soundToggle.hidden = true;
    return;
  }
  try {
    const response = await fetch(source.getAttribute("src"), { method: "HEAD", cache: "no-store" });
    if (!response.ok) els.soundToggle.hidden = true;
  } catch {
    els.soundToggle.hidden = true;
  }
}

function placeholderSvg(index) {
  const hue = 18 + (index * 9) % 36;
  const tall = index % 3 === 0;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${tall ? 1500 : 900}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="hsl(${hue},55%,96%)"/>
      <stop offset="1" stop-color="hsl(${hue + 20},42%,84%)"/>
    </linearGradient>
    <radialGradient id="r"><stop stop-color="rgba(255,255,255,.95)"/><stop offset="1" stop-color="rgba(255,255,255,0)"/></radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <circle cx="78%" cy="18%" r="280" fill="url(#r)"/>
  <path d="M0 ${tall ? 1150 : 650} Q260 ${tall ? 980 : 530} 520 ${tall ? 1180 : 700} T1200 ${tall ? 1040 : 610} V${tall ? 1500 : 900} H0Z" fill="rgba(255,255,255,.34)"/>
  <text x="50%" y="46%" text-anchor="middle" font-family="Georgia" font-size="92" fill="rgba(72,55,47,.62)">Our Story</text>
  <text x="50%" y="57%" text-anchor="middle" font-family="Arial" font-size="30" letter-spacing="10" fill="rgba(72,55,47,.42)">MEMORY ${String(index).padStart(2,"0")}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createPlaceholders(count) {
  const deck = shuffledCaptions(count);
  const notes = shuffledStoryNotes(count);
  return Array.from({ length: count }, (_, i) => ({
    index: i + 1,
    src: placeholderSvg(i + 1),
    caption: deck[i],
    storyNote: notes[i],
    name: `Placeholder ${i + 1}`,
    encryptedPath: null,
    mime: "image/svg+xml"
  }));
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

function shuffledFrom(source, count) {
  const deck = [...source];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  const result = [];
  while (result.length < count) {
    result.push(...deck);
  }
  return result.slice(0, count);
}

function shuffledCaptions(count) {
  return shuffledFrom(storyTexts.titles, count);
}

function shuffledStoryNotes(count) {
  return shuffledFrom(storyTexts.notes, count);
}

function typedText(el, onComplete) {
  if (!el || el.dataset.typed === "1") return;
  const text = el.dataset.caption || "";
  el.dataset.typed = "1";

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = text;
    if (onComplete) onComplete();
    return;
  }

  el.textContent = "";
  el.classList.add("typing");
  let index = 0;
  const step = () => {
    index += 1;
    el.textContent = text.slice(0, index);
    if (index < text.length) {
      setTimeout(step, 34 + Math.random() * 34);
    } else {
      el.classList.remove("typing");
      el.classList.add("typed");
      if (onComplete) setTimeout(onComplete, 260);
    }
  };
  setTimeout(step, 180);
}

function typeStoryCard(card) {
  if (!card || card.dataset.storyTyped === "1") return;
  card.dataset.storyTyped = "1";
  const title = card.querySelector(".type-caption");
  const note = card.querySelector(".type-note");
  typedText(title, () => typedText(note));
}

function maybeTypeVisibleCaptions() {
  document.querySelectorAll(".story-card:not([data-story-typed='1'])").forEach(card => {
    const marker = card.querySelector(".type-caption");
    if (!marker) return;
    const rect = marker.getBoundingClientRect();
    const triggerLine = innerHeight * 0.72;
    if (rect.top > 0 && rect.top < triggerLine) {
      setTimeout(() => typeStoryCard(card), 420);
    }
  });
}

function photoWord(n) {
  const a = n % 10, b = n % 100;
  if (a === 1 && b !== 11) return "фотография";
  if ([2,3,4].includes(a) && ![12,13,14].includes(b)) return "фотографии";
  return "фотографий";
}

function b64ToBytes(value) {
  const raw = atob(value);
  return Uint8Array.from(raw, ch => ch.charCodeAt(0));
}

async function deriveAlbumKey(password, saltB64, iterations) {
  const material = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: b64ToBytes(saltB64),
      iterations,
      hash: "SHA-256"
    },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
}

function openRememberDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(REMEMBER_DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(REMEMBER_STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function rememberFingerprint(descriptor) {
  const data = JSON.stringify({
    version: descriptor.version,
    salt: descriptor.salt,
    iterations: descriptor.iterations,
    manifest: descriptor.manifest
  });
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(digest)));
}

async function getRememberedKey(descriptor) {
  const fingerprint = await rememberFingerprint(descriptor);
  const db = await openRememberDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(REMEMBER_STORE, "readonly");
    const request = tx.objectStore(REMEMBER_STORE).get(REMEMBER_KEY);
    request.onsuccess = () => {
      const saved = request.result;
      resolve(saved && saved.fingerprint === fingerprint ? saved.key : null);
    };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

async function saveRememberedKey(descriptor, key) {
  const fingerprint = await rememberFingerprint(descriptor);
  const db = await openRememberDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(REMEMBER_STORE, "readwrite");
    tx.objectStore(REMEMBER_STORE).put({ fingerprint, key, savedAt: Date.now() }, REMEMBER_KEY);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => reject(tx.error);
  });
}

async function clearRememberedKey() {
  const db = await openRememberDb();
  return new Promise(resolve => {
    const tx = db.transaction(REMEMBER_STORE, "readwrite");
    tx.objectStore(REMEMBER_STORE).delete(REMEMBER_KEY);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); resolve(); };
  });
}

async function decryptPayload(buffer, nonceB64, key) {
  return crypto.subtle.decrypt(
    { name: "AES-GCM", iv: b64ToBytes(nonceB64) },
    key,
    buffer
  );
}

function photoAsset(item, kind) {
  if (item[kind] && item[kind].path) return item[kind];
  if (kind === "thumb" && item.full && item.full.path) return item.full;
  return item;
}

function enqueueDecrypt(task) {
  return new Promise((resolve, reject) => {
    decryptQueue.push({ task, resolve, reject });
    runDecryptQueue();
  });
}

function runDecryptQueue() {
  while (activeDecrypts < MAX_ACTIVE_DECRYPTS && decryptQueue.length) {
    const item = decryptQueue.shift();
    activeDecrypts += 1;
    item.task()
      .then(item.resolve, item.reject)
      .finally(() => {
        activeDecrypts -= 1;
        runDecryptQueue();
      });
  }
}

async function decryptPhotoUrl(photo, kind = "full") {
  const cacheKey = `${photo.index}:${kind}`;
  if (photoUrlCache.has(cacheKey)) return photoUrlCache.get(cacheKey);
  if (photoUrlPromises.has(cacheKey)) return photoUrlPromises.get(cacheKey);

  const asset = photoAsset(photo.encrypted, kind);
  if (!asset || !asset.path || !asset.nonce) return photo.src;

  const promise = enqueueDecrypt(async () => {
    const response = await fetch(asset.path, { cache: "force-cache" });
    if (!response.ok) throw new Error("PHOTO_NOT_FOUND");

    const plain = await decryptPayload(await response.arrayBuffer(), asset.nonce, derivedKey);
    const blob = new Blob([plain], { type: asset.mime || "image/jpeg" });
    const url = URL.createObjectURL(blob);
    decryptedUrls.push(url);
    photoUrlCache.set(cacheKey, url);
    return url;
  }).finally(() => photoUrlPromises.delete(cacheKey));

  photoUrlPromises.set(cacheKey, promise);
  return promise;
}

async function hydrateImage(img, photo, kind = "thumb") {
  if (!derivedKey || img.dataset.loaded === "1") return;
  img.dataset.loaded = "1";
  try {
    img.src = await decryptPhotoUrl(photo, kind);
  } catch (error) {
    console.error(error);
    img.dataset.loaded = "0";
  }
}
function preloadPhoto(photo, kind = "full") {
  if (!derivedKey || !photo) return;
  decryptPhotoUrl(photo, kind).catch(error => console.warn("Photo preload skipped", error));
}
function preloadLightboxNeighbors(index = currentIndex, radius = 2) {
  if (!photos.length) return;
  for (let offset = 1; offset <= radius; offset += 1) {
    preloadPhoto(photos[(index + offset) % photos.length], "full");
    preloadPhoto(photos[(index - offset + photos.length) % photos.length], "full");
  }
}
function scheduleInitialFullPreload() {
  const run = () => {
    const total = Math.min(photos.length, 6);
    for (let i = 0; i < total; i += 1) preloadPhoto(photos[i], "full");
  };
  if ("requestIdleCallback" in window) requestIdleCallback(run, { timeout: 3500 });
  else setTimeout(run, 1200);
}

async function fetchAlbumDescriptor() {
  const descriptorResponse = await fetch("assets/encrypted/album.json", { cache: "no-store" });
  if (!descriptorResponse.ok) throw new Error("ALBUM_NOT_BUILT");
  return descriptorResponse.json();
}

async function loadEncryptedAlbumWithKey(key, descriptor) {
  const manifestResponse = await fetch(descriptor.manifest.path, { cache: "no-store" });
  if (!manifestResponse.ok) throw new Error("MANIFEST_NOT_FOUND");

  const manifestPlain = await decryptPayload(
    await manifestResponse.arrayBuffer(),
    descriptor.manifest.nonce,
    key
  );
  const manifest = JSON.parse(new TextDecoder().decode(manifestPlain));

  derivedKey = key;
  albumMeta = descriptor;

  els.lockStatus.textContent = `Манифест открыт. Готово фото: ${manifest.photos.length}.`;
  const captionDeck = shuffledCaptions(manifest.photos.length);
  const noteDeck = shuffledStoryNotes(manifest.photos.length);
  photos = manifest.photos.map((item, i) => ({
    index: i + 1,
    src: placeholderSvg(i + 1),
    caption: item.caption || captionDeck[i],
    storyNote: item.storyNote || noteDeck[i],
    name: item.name || `Фото ${i + 1}`,
    mime: photoAsset(item, "full").mime || "image/jpeg",
    encrypted: item
  }));

  document.title = manifest.title || "Our Story";
  document.querySelector("h1").textContent = manifest.title || "Our Story";
  document.querySelector(".quote-break blockquote").textContent =
    manifest.quote || "Некоторые мгновения проходят. Другие остаются жить внутри нас.";

  renderAll();
}

async function loadEncryptedAlbum(password) {
  const descriptor = await fetchAlbumDescriptor();
  const key = await deriveAlbumKey(password, descriptor.salt, descriptor.iterations);
  await loadEncryptedAlbumWithKey(key, descriptor);
  return { key, descriptor };
}

function unlockUi({ scroll = true, delay = 650 } = {}) {
  setTimeout(() => {
    document.body.classList.remove("locked");
    els.lockScreen.classList.add("unlocked");
    window.setTimeout(() => {
      els.lockScreen.hidden = true;
    }, 950);
    if (scroll) document.querySelector(".intro").scrollIntoView({ behavior: "smooth" });
  }, delay);
}

els.unlockForm.addEventListener("submit", async event => {
  event.preventDefault();
  const password = els.passwordInput.value;
  if (!password) return;

  els.lockStatus.className = "lock-status";
  els.lockStatus.textContent = "Проверяю секретную фразу…";
  els.lockScreen.classList.add("decrypting");

  try {
    const unlocked = await loadEncryptedAlbum(password);
    if (els.rememberDevice?.checked) {
      try {
        await saveRememberedKey(unlocked.descriptor, unlocked.key);
      } catch (rememberError) {
        console.warn("Could not remember this device", rememberError);
      }
    } else {
      await clearRememberedKey();
    }
    els.lockStatus.textContent = "История открыта ♥";
    els.lockStatus.classList.add("success");
    sessionStorage.setItem("our-story-unlocked", "1");

    unlockUi({ delay: 650 });
  } catch (error) {
    console.error(error);
    els.passwordInput.select();
    els.lockStatus.classList.add("error");

    if (error.message === "ALBUM_NOT_BUILT") {
      els.lockStatus.textContent = "Сначала запустите BUILD_ENCRYPTED_ALBUM.bat и загрузите созданные файлы на GitHub.";
    } else {
      window.location.assign("wrong-password.html");
    }
  } finally {
    els.lockScreen.classList.remove("decrypting");
  }
});

async function tryRememberedUnlock() {
  if (typeof indexedDB === "undefined" || !crypto?.subtle) return;
  els.lockStatus.textContent = "Проверяю это устройство…";
  try {
    const descriptor = await fetchAlbumDescriptor();
    const key = await getRememberedKey(descriptor);
    if (!key) {
      els.lockStatus.textContent = "Ожидаю секретную фразу…";
      return;
    }
    els.lockScreen.classList.add("decrypting");
    await loadEncryptedAlbumWithKey(key, descriptor);
    els.lockStatus.textContent = "Устройство узнано. История открыта ♥";
    els.lockStatus.classList.add("success");
    unlockUi({ delay: 520 });
  } catch (error) {
    console.warn("Remembered unlock failed", error);
    await clearRememberedKey();
    els.lockStatus.textContent = "Ожидаю секретную фразу…";
  } finally {
    els.lockScreen.classList.remove("decrypting");
  }
}

function renderAll() {
  els.photoCount.textContent = photos.length;
  if (els.favoriteCount) els.favoriteCount.textContent = "0";
  els.heroSubtitle.textContent = `${photos.length} ${photoWord(photos.length)}. Одна зашифрованная история.`;
  renderStory();
  renderGallery();
  renderCollage();
  observeReveals();
  scheduleInitialFullPreload();
}

function renderStory() {
  els.featured.innerHTML = "";
  photos.forEach((p, idx) => {
    const card = document.createElement("article");
    card.className = "story-card reveal";
    card.innerHTML = `
      <div class="story-image-wrap" data-tilt>
        <img class="story-image" loading="lazy" src="${p.src}" alt="${escapeHtml(p.name)}" data-photo-index="${idx}" data-kind="thumb">
      </div>
      <div class="story-text">
        <div class="story-number">${String(idx + 1).padStart(2, "0")}</div>
        <h3 class="type-caption"></h3>
        <p class="type-note"></p>
      </div>`;
    const captionEl = card.querySelector(".type-caption");
    const noteEl = card.querySelector(".type-note");
    captionEl.dataset.caption = p.caption;
    noteEl.dataset.caption = p.storyNote;
    els.featured.appendChild(card);
    addTilt(card.querySelector("[data-tilt]"));
  });
}

function renderGallery() {
  els.gallery.innerHTML = "";
  photos.forEach((p, i) => {
    const card = document.createElement("button");
    card.className = "photo-card";
    card.setAttribute("aria-label", `Открыть фото ${i + 1}`);
    card.innerHTML = `<img loading="lazy" src="${p.src}" alt="${escapeHtml(p.name)}" data-photo-index="${i}" data-kind="thumb">`;
    card.addEventListener("click", () => openLightbox(i));
    card.addEventListener("pointerenter", () => preloadPhoto(p, "full"), { passive: true });
    card.addEventListener("focus", () => preloadPhoto(p, "full"));
    els.gallery.appendChild(card);
    galleryObserver.observe(card);
  });
}

function renderCollage() {
  els.collage.innerHTML = "";
  els.collage.classList.remove("assembled");
  const total = photos.length;
  photos.forEach((p, i) => {
    const t = Math.PI - (i / Math.max(total - 1, 1)) * Math.PI * 2;
    const heartX = 16 * Math.pow(Math.sin(t), 3);
    const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    const x = 50 + heartX * 2.65;
    const y = 50 + heartY * 2.9;
    const side = i % 4;
    const start = [
      { x: -18 - Math.random() * 22, y: Math.random() * 115 },
      { x: 118 + Math.random() * 22, y: Math.random() * 115 },
      { x: Math.random() * 115, y: -18 - Math.random() * 22 },
      { x: Math.random() * 115, y: 118 + Math.random() * 22 }
    ][side];
    const img = new Image();
    img.loading = "lazy";
    img.src = p.src;
    img.alt = "";
    img.dataset.photoIndex = String(p.index - 1);
    img.dataset.kind = "thumb";
    img.dataset.deferHydrate = "finale";
    img.style.setProperty("--tx", `${x}%`);
    img.style.setProperty("--ty", `${y}%`);
    img.style.setProperty("--sx", `${start.x}%`);
    img.style.setProperty("--sy", `${start.y}%`);
    img.style.setProperty("--delay", `${Math.min(i * 70, 4200)}ms`);
    img.style.setProperty("--rot", `${-18 + Math.random() * 36}deg`);
    els.collage.appendChild(img);
  });
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
  });
}, { threshold: .12 });

const galleryObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
    const img = e.target.matches("img[data-photo-index]")
      ? e.target
      : e.target.querySelector("img[data-photo-index]");
    if (img?.dataset.deferHydrate === "finale") return;
    if (img) hydrateImage(img, photos[Number(img.dataset.photoIndex)], img.dataset.kind || "thumb");
  });
}, { threshold: .06 });

const finaleObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    els.collage.classList.add("assembled");
    els.collage.querySelectorAll("img[data-photo-index]").forEach((img, i) => {
      setTimeout(() => {
        hydrateImage(img, photos[Number(img.dataset.photoIndex)], "thumb");
      }, Math.min(i * 95, 5200));
    });
  });
}, { threshold: .34 });

function observeReveals() {
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
  document.querySelectorAll(".photo-card").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 8) * 45}ms`;
    galleryObserver.observe(el);
  });
  document.querySelectorAll("img[data-photo-index]").forEach(img => galleryObserver.observe(img));
  const finale = document.querySelector(".finale");
  if (finale) finaleObserver.observe(finale);
}

function addTilt(el) {
  el.addEventListener("mousemove", event => {
    if (!effectsEnabled) return;
    const r = el.getBoundingClientRect();
    const x = (event.clientX - r.left) / r.width - .5;
    const y = (event.clientY - r.top) / r.height - .5;
    el.style.transform = `rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
  });
  el.addEventListener("mouseleave", () => el.style.transform = "");
}

document.getElementById("beginButton").addEventListener("click", () =>
  document.querySelector(".intro").scrollIntoView({ behavior: "smooth" })
);
document.getElementById("restartButton").addEventListener("click", () =>
  scrollTo({ top: 0, behavior: "smooth" })
);

document.querySelectorAll(".view-button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".view-button").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    els.gallery.className = `gallery ${button.dataset.view}`;
  });
});

async function openLightbox(index) {
  currentIndex = index;
  await updateLightbox();
  els.lightbox.showModal();
  document.body.style.overflow = "hidden";
  preloadLightboxNeighbors(currentIndex, 3);
}
function prefersReducedMotion() {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function nextPaint() {
  return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}
function finishAnimation(animation) {
  return animation.finished.catch(() => {});
}
function playLightboxFeedback(delta) {
  if (navigator.vibrate) navigator.vibrate(12);
  if (prefersReducedMotion()) return;

  try {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    navAudioContext ||= new AudioCtor();
    if (navAudioContext.state === "suspended") navAudioContext.resume();
    const now = navAudioContext.currentTime;
    const oscillator = navAudioContext.createOscillator();
    const gain = navAudioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(delta > 0 ? 520 : 440, now);
    oscillator.frequency.exponentialRampToValueAtTime(delta > 0 ? 660 : 360, now + .06);
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(.026, now + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .09);
    oscillator.connect(gain).connect(navAudioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + .1);
  } catch {
    navAudioContext = null;
  }
}
function setLightboxPhase(phase, delta = 0) {
  els.lightbox.dataset.phase = phase;
  els.lightbox.dataset.direction = delta > 0 ? "next" : "prev";
}
async function decodeImage(src) {
  const image = new Image();
  image.decoding = "async";
  image.src = src;
  if (image.decode) {
    try { await image.decode(); }
    catch { await new Promise(resolve => { image.onload = image.onerror = resolve; }); }
  } else {
    await new Promise(resolve => { image.onload = image.onerror = resolve; });
  }
  return image;
}
function setLightboxDrag(dx) {
  if (prefersReducedMotion()) return;
  const width = els.lightboxImageWrap.getBoundingClientRect().width || innerWidth;
  const limited = Math.max(-width * .72, Math.min(width * .72, dx));
  const progress = Math.min(1, Math.abs(limited) / (width * .72));
  const turn = Math.max(-18, Math.min(18, limited * .07));
  els.lightbox.dataset.dragging = "true";
  els.lightboxImage.style.transformOrigin = dx > 0 ? "left center" : "right center";
  els.lightboxImage.style.transform = `perspective(1200px) translateX(${limited}px) rotateY(${-turn}deg) scale(${1 - progress * .035})`;
  els.lightboxImage.style.opacity = String(1 - progress * .12);
}
function resetLightboxDrag() {
  lightboxTouchDragging = false;
  lightboxTouchDx = 0;
  lightboxTouchDy = 0;
  els.lightbox.removeAttribute("data-dragging");
  els.lightboxImage.style.transform = "";
  els.lightboxImage.style.transformOrigin = "";
  els.lightboxImage.style.opacity = "";
}
function resetLightboxNextLayer() {
  els.lightboxImageNext.removeAttribute("src");
  els.lightboxImageNext.alt = "";
  els.lightboxImageNext.setAttribute("aria-hidden", "true");
  els.lightboxImageNext.style.transform = "";
  els.lightboxImageNext.style.opacity = "";
  els.lightboxImageNext.style.filter = "";
}
async function updateLightbox(delta = 0) {
  const p = photos[currentIndex];
  const shouldAnimate = delta && els.lightbox.open && !prefersReducedMotion();
  const nextSrc = await decryptPhotoUrl(p, "full");

  if (!shouldAnimate) {
    els.lightboxImage.src = nextSrc;
    els.lightboxImage.alt = p.name;
    els.lightboxCaption.textContent = p.caption;
    els.lightboxCounter.textContent = `${currentIndex + 1} / ${photos.length}`;
    return;
  }

  const incoming = await decodeImage(nextSrc);
  incoming.className = "lightbox-page lightbox-page-incoming";
  incoming.alt = p.name;
  els.lightboxImageWrap.appendChild(incoming);
  els.lightboxImage.classList.add("lightbox-page-outgoing");
  setLightboxPhase("turn", delta);
  await wait(820);
  els.lightboxImage.src = nextSrc;
  els.lightboxImage.alt = p.name;
  if (els.lightboxImage.decode) {
    try { await els.lightboxImage.decode(); }
    catch {}
  }
  els.lightboxCaption.textContent = p.caption;
  els.lightboxCounter.textContent = `${currentIndex + 1} / ${photos.length}`;
  els.lightboxImage.classList.remove("lightbox-page-outgoing");
  await nextPaint();
  incoming.remove();
  els.lightbox.removeAttribute("data-phase");
  els.lightbox.removeAttribute("data-direction");
}
async function animateLightboxTurn(delta, dragOffset = 0) {
  const p = photos[currentIndex];
  const nextSrc = await decryptPhotoUrl(p, "full");
  els.lightboxImageWrap.querySelectorAll(".lightbox-page").forEach(image => image.remove());
  const width = els.lightboxImageWrap.getBoundingClientRect().width || innerWidth;
  const direction = delta > 0 ? 1 : -1;
  const startX = Math.max(-width * .72, Math.min(width * .72, dragOffset || 0));
  const progress = Math.min(.82, Math.abs(startX) / (width * .72));
  const incomingStartX = direction * width * (1.04 - progress * .58);
  const duration = Math.max(430, 920 - progress * 310);
  const easing = "cubic-bezier(.18,.82,.18,1)";

  els.lightboxImageNext.src = nextSrc;
  els.lightboxImageNext.alt = p.name;
  els.lightboxImageNext.setAttribute("aria-hidden", "false");
  if (els.lightboxImageNext.decode) {
    try { await els.lightboxImageNext.decode(); }
    catch {}
  }
  els.lightboxImageNext.style.transform = `translateX(${incomingStartX}px) scale(.98)`;
  els.lightboxImageNext.style.opacity = String(.36 + progress * .36);
  els.lightboxImageNext.style.filter = "drop-shadow(0 14px 34px rgba(62,44,36,.12)) brightness(1.03)";
  els.lightboxImage.classList.add("lightbox-page-outgoing");
  els.lightbox.dataset.phase = "turning";

  const outgoing = els.lightboxImage.animate([
    {
      transform: `translateX(${startX}px) scale(${1 - progress * .025})`,
      opacity: 1 - progress * .12,
      filter: "drop-shadow(0 30px 80px rgba(62,44,36,.24))"
    },
    {
      transform: `translateX(${-direction * width * 1.08}px) scale(.965)`,
      opacity: .18,
      filter: "drop-shadow(0 12px 28px rgba(62,44,36,.1)) brightness(.96)"
    }
  ], { duration, easing, fill: "forwards" });

  const incomingAnimation = els.lightboxImageNext.animate([
    {
      transform: `translateX(${incomingStartX}px) scale(.98)`,
      opacity: .36 + progress * .36,
      filter: "drop-shadow(0 14px 34px rgba(62,44,36,.12)) brightness(1.03)"
    },
    {
      transform: "translateX(0) scale(1)",
      opacity: 1,
      filter: "drop-shadow(0 30px 80px rgba(62,44,36,.24)) brightness(1)"
    }
  ], { duration, easing, fill: "forwards" });

  const captionAnimation = els.lightbox.querySelector("figcaption").animate([
    { opacity: .58, transform: "translateY(6px)" },
    { opacity: 1, transform: "translateY(0)" }
  ], { duration, easing, fill: "both" });

  try {
    await Promise.all([outgoing, incomingAnimation, captionAnimation].map(finishAnimation));
    els.lightboxImage.src = nextSrc;
    els.lightboxImage.alt = p.name;
    if (els.lightboxImage.decode) {
      try { await els.lightboxImage.decode(); }
      catch {}
    }
    els.lightboxCaption.textContent = p.caption;
    els.lightboxCounter.textContent = `${currentIndex + 1} / ${photos.length}`;
    await nextPaint();
  } finally {
    outgoing.cancel();
    incomingAnimation.cancel();
    captionAnimation.cancel();
    els.lightboxImage.classList.remove("lightbox-page-outgoing");
    els.lightboxImage.style.transform = "";
    els.lightboxImage.style.opacity = "";
    els.lightboxImage.style.filter = "";
    els.lightboxImage.style.transformOrigin = "";
    els.lightboxImageWrap.querySelectorAll(".lightbox-page").forEach(image => image.remove());
    resetLightboxNextLayer();
    lightboxTouchDragging = false;
    lightboxTouchDx = 0;
    lightboxTouchDy = 0;
    els.lightbox.removeAttribute("data-dragging");
    els.lightbox.removeAttribute("data-phase");
  }
}
function closeLightbox() {
  els.lightbox.close();
  document.body.style.overflow = "";
  resetLightboxDrag();
  els.lightboxImageWrap.querySelectorAll(".lightbox-page").forEach(image => image.remove());
  resetLightboxNextLayer();
  els.lightboxImage.classList.remove("lightbox-page-outgoing");
  els.lightbox.removeAttribute("data-phase");
  els.lightbox.removeAttribute("data-direction");
}
async function moveLightbox(delta, dragOffset = 0) {
  if (lightboxAnimating || photos.length < 2) return;
  lightboxAnimating = true;
  playLightboxFeedback(delta);
  currentIndex = (currentIndex + delta + photos.length) % photos.length;
  try {
    if (delta && els.lightbox.open && !prefersReducedMotion()) {
      await animateLightboxTurn(delta, dragOffset);
    } else {
      resetLightboxDrag();
      await updateLightbox(delta);
    }
    preloadLightboxNeighbors(currentIndex, 3);
  } finally {
    lightboxAnimating = false;
  }
}
document.getElementById("lightboxClose").onclick = closeLightbox;
document.getElementById("lightboxPrev").onclick = () => moveLightbox(-1);
document.getElementById("lightboxNext").onclick = () => moveLightbox(1);
els.lightbox.addEventListener("click", e => { if (e.target === els.lightbox) closeLightbox(); });
let lightboxTouchStartX = 0;
let lightboxTouchStartY = 0;
els.lightbox.addEventListener("touchstart", e => {
  if (lightboxAnimating) return;
  els.lightboxImageWrap.querySelectorAll(".lightbox-page").forEach(image => image.remove());
  resetLightboxNextLayer();
  const touch = e.changedTouches[0];
  lightboxTouchStartX = touch.clientX;
  lightboxTouchStartY = touch.clientY;
  lightboxTouchDx = 0;
  lightboxTouchDy = 0;
  lightboxTouchDragging = false;
}, { passive: true });
els.lightbox.addEventListener("touchmove", e => {
  if (lightboxAnimating || e.changedTouches.length !== 1) return;
  const touch = e.changedTouches[0];
  lightboxTouchDx = touch.clientX - lightboxTouchStartX;
  lightboxTouchDy = touch.clientY - lightboxTouchStartY;
  const horizontal = Math.abs(lightboxTouchDx) > 12 && Math.abs(lightboxTouchDx) > Math.abs(lightboxTouchDy) * 1.2;
  if (!horizontal) return;
  e.preventDefault();
  lightboxTouchDragging = true;
  setLightboxDrag(lightboxTouchDx);
}, { passive: false });
els.lightbox.addEventListener("touchend", e => {
  const touch = e.changedTouches[0];
  const dx = lightboxTouchDx || touch.clientX - lightboxTouchStartX;
  const dy = lightboxTouchDy || touch.clientY - lightboxTouchStartY;
  if (Math.abs(dx) > 54 && Math.abs(dx) > Math.abs(dy) * 1.35) {
    const delta = dx > 0 ? -1 : 1;
    moveLightbox(delta, dx);
  } else if (lightboxTouchDragging) {
    resetLightboxDrag();
  }
}, { passive: true });
els.lightbox.addEventListener("touchcancel", resetLightboxDrag, { passive: true });
document.addEventListener("keydown", e => {
  if (!els.lightbox.open) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") moveLightbox(-1);
  if (e.key === "ArrowRight") moveLightbox(1);
});

els.soundToggle.addEventListener("click", async () => {
  soundOn = !soundOn;
  els.soundToggle.textContent = soundOn ? "❚❚" : "♫";
  if (soundOn) {
    try { await els.audio.play(); }
    catch { soundOn = false; els.soundToggle.textContent = "♫"; }
  } else els.audio.pause();
});

els.effectsToggle.addEventListener("click", () => {
  effectsEnabled = !effectsEnabled;
  document.body.classList.toggle("effects-off", !effectsEnabled);
  els.effectsToggle.classList.toggle("active", effectsEnabled);
});

const cursorGlow = document.getElementById("cursorGlow");
addEventListener("pointermove", e => {
  cursorGlow.style.left = e.clientX + "px";
  cursorGlow.style.top = e.clientY + "px";
});
addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  document.getElementById("scrollProgress").style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
  maybeTypeVisibleCaptions();
}, { passive: true });

const title = document.querySelector("[data-split]");
title.innerHTML = [...title.textContent].map((ch, i) =>
  `<span style="animation-delay:${i * .055}s">${ch === " " ? "&nbsp;" : ch}</span>`
).join("");

const canvas = document.getElementById("lightCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
function resizeCanvas() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  particles = Array.from({ length: Math.min(48, Math.floor(innerWidth / 26)) }, () => ({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    r: Math.random() * 2.4 + .5, vx: (Math.random() - .5) * .08,
    vy: -Math.random() * .16 - .02, a: Math.random() * .22 + .05
  }));
}
function animateParticles() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  if (effectsEnabled) {
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -10) { p.y = innerHeight + 10; p.x = Math.random() * innerWidth; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.a})`;
      ctx.shadowBlur = 14;
      ctx.shadowColor = "rgba(255,235,220,.9)";
      ctx.fill();
    }
  }
  requestAnimationFrame(animateParticles);
}
resizeCanvas();
animateParticles();
addEventListener("resize", resizeCanvas);
addEventListener("resize", maybeTypeVisibleCaptions);

addEventListener("beforeunload", () => decryptedUrls.forEach(URL.revokeObjectURL));
setupAudioControl();
async function init() {
  await loadStoryTexts();
  photos = createPlaceholders(24);
  renderAll();
  tryRememberedUnlock();
}
init();
