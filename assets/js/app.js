
const captions = [
  "Тот самый свет",
  "Смеяться вместе",
  "Тишина на двоих",
  "Ближе, чем вчера",
  "Мгновение без времени",
  "Наш маленький мир",
  "Где начинается нежность",
  "Оставаться рядом",
  "Когда всё стало теплее",
  "День, который хочется сохранить",
  "Наша маленькая вечность",
  "Там, где спокойно",
  "Взгляд, который всё сказал",
  "Свет между нами",
  "Место, куда хочется вернуться",
  "Нежность в простых деталях",
  "Этот кадр умеет обнимать",
  "Случайность, ставшая любимой",
  "Пауза, в которой было всё",
  "Мы в своём ритме",
  "Тепло на кончиках пальцев",
  "Город помнит нас такими",
  "Вечер, который не закончился",
  "Просто быть рядом",
  "Счастье без громких слов",
  "Мир стал немного мягче",
  "Секунда, полная нас",
  "Улыбка, к которой возвращаешься",
  "Наше тихое чудо",
  "Когда сердце узнаёт дом",
  "Между светом и смехом",
  "Так выглядит покой",
  "Сохранено внутри",
  "Маленькая глава большой истории",
  "Любовь в естественном свете",
  "Мы и этот прекрасный момент",
  "Теплее любого солнца",
  "Один кадр, тысяча чувств",
  "То, что не хочется объяснять",
  "Всё настоящее начинается тихо",
  "Дыхание одного дня",
  "Память с мягкими краями",
  "Наш секретный маршрут",
  "Вместе даже в тишине",
  "Рядом — самое красивое место",
  "Светлый след этого дня",
  "Без спешки. Без лишнего. Мы",
  "То самое чувство дома",
  "Кадр, который улыбается",
  "Нежность, пойманная вовремя",
  "Внутри этого света",
  "Момент, который выбрал нас",
  "Наше маленькое кино",
  "Здесь было очень живо",
  "Счастье в мягком фокусе",
  "Время замедлилось для нас",
  "Два человека и целый мир",
  "Линия света через память",
  "Прогулка внутри сердца",
  "Где всё простое становится важным",
  "Смех, который остаётся",
  "Невесомый день",
  "Почти сон, но наш",
  "Всё, что нужно, уже здесь",
  "Светлее, чем на фотографии",
  "Случайный кадр, родной навсегда",
  "Наша тихая магия",
  "Пока мир был добрым",
  "Место встречи тепла",
  "Когда рядом достаточно",
  "День с мягким сердцем",
  "Воспоминание, которое дышит",
  "Немного света для нас двоих",
  "Сохранить и не отпускать",
  "Лёгкость одного мгновения",
  "Здесь мы были особенно собой",
  "Кадр между смехом и объятием",
  "Всё главное без слов",
  "Наша красивая случайность",
  "Там, где начинается улыбка",
  "Свет, который нашли вместе",
  "Минуты, ставшие драгоценными",
  "Тепло обычного дня",
  "В этом кадре живёт нежность",
  "Одна история на двоих",
  "Тише, ближе, настоящее",
  "След счастья на плёнке",
  "Тот вечер внутри нас",
  "Маленькое доказательство любви",
  "Когда день держал нас за руки",
  "Сердце помнит именно так",
  "Простое фото, сложное чувство",
  "Наш светлый уголок",
  "Пока всё было рядом",
  "Момент с тихим сиянием",
  "Взгляд из нашей главы",
  "День, который стал письмом",
  "Там, где нам хорошо",
  "Смех на память",
  "Здесь любовь без декораций",
  "Красиво, потому что наше",
  "Маленькая остановка счастья",
  "Фото, в котором тепло",
  "Между нами — свет",
  "Наша нежная география",
  "Время, которое не хочется листать",
  "Любимый воздух этого дня",
  "Момент, который умеет ждать",
  "Светлая точка на карте памяти",
  "Всё началось с простого рядом",
  "Там, где сердце мягче",
  "Наша история без шума",
  "Кадр, полный воздуха и тепла",
  "Так звучит спокойствие",
  "Место для двух улыбок",
  "Счастье, пойманное случайно",
  "Нежный след одного дня",
  "Внутри этой минуты",
  "Мы — главная деталь",
  "Память, которую хочется беречь",
  "Когда всё совпало",
  "Тёплый свет нашей тишины",
  "Этот день всё ещё рядом",
  "Кадр, где мир добрее",
  "Небольшое вечное",
  "На расстоянии одного объятия",
  "Здесь было много сердца",
  "Любовь в тихом кадре",
  "Мягкая страница нашей истории",
  "Тот самый внутренний свет",
  "Обычный день, ставший любимым",
  "Смотреть и снова улыбаться",
  "Мы среди света",
  "Минута, которую не стереть",
  "Счастье без подписи",
  "Кадр, который всё понял",
  "Дом — это рядом",
  "Тонкая линия нежности",
  "Остаться бы здесь подольше",
  "Всё лучшее случилось тихо",
  "Наша память в тёплых тонах",
  "Два сердца в одном кадре",
  "Когда фотография становится письмом",
  "Маленькая вечность в большом дне",
  "Самое родное место кадра",
  "Свет, который не гаснет"
];

const storyNotes = [
  "Это мгновение осталось тихим доказательством того, что счастье умеет быть очень простым.",
  "Иногда один кадр хранит больше тепла, чем длинное письмо.",
  "Здесь нет ничего лишнего — только свет, воздух и чувство, к которому хочется возвращаться.",
  "Такие моменты не требуют громких слов. Они просто становятся частью сердца.",
  "Память бережно держит этот день, как маленькую тайну на двоих.",
  "В этом кадре живёт спокойствие, которое появляется только рядом с родным человеком.",
  "Кажется, время здесь замедлилось специально, чтобы мы успели всё почувствовать.",
  "Обычная минута стала особенной, потому что в ней были мы.",
  "Это фото похоже на тихий вдох перед чем-то очень хорошим.",
  "Всё настоящее часто выглядит именно так: просто, мягко и без лишнего шума.",
  "Здесь свет ложится так, будто сам хотел сохранить этот момент.",
  "Маленькая часть нашей истории, которую приятно открыть снова.",
  "В этой фотографии осталось то тепло, которое невозможно придумать специально.",
  "Каждый раз, когда смотришь сюда, день будто становится чуть ближе.",
  "Так выглядит память, когда она улыбается.",
  "Этот кадр бережно напоминает: рядом — уже достаточно.",
  "В нём есть спокойная радость, которую не нужно объяснять.",
  "Иногда счастье помещается в одну фотографию и всё равно остаётся большим.",
  "Этот момент не прошёл. Он просто стал светом внутри нашей истории.",
  "Фото поймало не только картинку, но и настроение, которое хочется сохранить.",
  "Здесь всё настоящее: взгляд, пауза, воздух и нежность между строк.",
  "Такие кадры становятся маленькими якорями для сердца.",
  "Воспоминание будто оставило нам записку: это было важно.",
  "Смотреть сюда — как возвращаться в тёплую комнату после долгого дня.",
  "Этот день стал мягче, потому что мы прожили его вместе.",
  "Кадр тихий, но внутри него очень много жизни.",
  "В нём осталось то, что нельзя повторить, но можно беречь.",
  "Мир на секунду стал добрее, и фотография успела это заметить.",
  "Здесь наша история говорит почти шёпотом, но очень ясно.",
  "Каждая деталь напоминает, что любовь часто прячется в простых вещах.",
  "Это не просто фото. Это маленькое место, где нам всё ещё хорошо.",
  "Время прошло дальше, а этот свет остался с нами.",
  "Момент, который хочется держать бережно, как письмо в кармане.",
  "В этой тишине есть больше нежности, чем в сотне громких обещаний.",
  "Фото сохранило не идеальность, а самое ценное — живое чувство.",
  "Здесь мы были настолько собой, что кадр стал родным.",
  "Иногда память выбирает именно такие минуты, чтобы остаться навсегда.",
  "Свет, который здесь есть, кажется внутренним.",
  "Этот кадр похож на маленькую паузу, где всё наконец на своём месте.",
  "В нём осталось ощущение дома, даже если дом был просто рядом.",
  "Такие фотографии не стареют. Они только становятся теплее.",
  "Маленькая сцена большого чувства, которое не поместилось бы в слова.",
  "Это мгновение тихо говорит: мы были счастливы здесь.",
  "Кадр держит день за руку и не отпускает.",
  "Смотреть на него — значит снова услышать тот самый воздух.",
  "Здесь всё собрано бережно: свет, улыбка и немного вечности.",
  "Эта минута стала частью нас раньше, чем мы успели это понять.",
  "Фото оставило дверь приоткрытой туда, где было тепло.",
  "В нём есть мягкая правда нашего общего времени.",
  "Кажется, этот кадр знает о нас что-то очень доброе.",
  "Такие моменты не исчезают. Они меняют место и живут внутри.",
  "Здесь любовь не позирует, а просто присутствует.",
  "Один спокойный фрагмент дня, который оказался драгоценным.",
  "Воспоминание получилось светлым, потому что внутри него было настоящее.",
  "Этот кадр будто создан для того, чтобы возвращать улыбку.",
  "В нём много воздуха, тепла и той самой близости без слов.",
  "Такая память не просит внимания, но всегда его заслуживает.",
  "Фото сохранило секунду, а сердце сохранило всё остальное.",
  "Здесь простота стала красивой, потому что она наша.",
  "Этот момент похож на тихое обещание беречь друг друга.",
  "В нём слышится смех, даже если на фото тишина.",
  "Память любит такие кадры: честные, мягкие, живые.",
  "Это маленькое доказательство того, что хорошие дни бывают настоящими.",
  "Кадр получился тёплым не из-за света, а из-за нас.",
  "Здесь нет случайных деталей — всё стало частью настроения.",
  "Этот фрагмент дня хочется пересматривать медленно.",
  "В нём есть то чувство, которое узнаёшь сразу и безошибочно.",
  "Фото стало местом, куда можно вернуться одним взглядом.",
  "Этот момент сохранился так бережно, будто знал, что будет нужен.",
  "Внутри кадра осталось немного солнца и много сердца.",
  "Здесь наша история на секунду остановилась и улыбнулась.",
  "Иногда кадр становится красивым просто потому, что он честный.",
  "В нём осталось ощущение, будто мир был совсем рядом и совсем добрый.",
  "Этот день теперь живёт не в календаре, а в памяти.",
  "Кадр, где нежность не говорит громко, но её невозможно не заметить.",
  "Смотреть сюда — как снова оказаться в правильном месте.",
  "Это фото хранит тепло, которое не выцветает.",
  "В нём есть маленькая тишина, полная большого смысла.",
  "Момент прошёл быстро, но остался очень надолго.",
  "Здесь всё кажется мягче: свет, время и само воспоминание.",
  "Этот кадр умеет напоминать, почему всё было важно.",
  "Он сохранил не только лица, но и расстояние между сердцами.",
  "В такой минуте не нужно ничего менять.",
  "Фото стало тихой страницей нашей общей книги.",
  "Здесь каждый оттенок будто говорит: это было нашим.",
  "Маленькая остановка, где сердце всё ещё узнаёт себя.",
  "Внутри этого кадра осталось больше, чем видно с первого взгляда.",
  "Такие моменты становятся светом, который берёшь с собой.",
  "Фото не объясняет счастье, но очень бережно его показывает.",
  "Здесь всё простое оказалось самым дорогим.",
  "Этот кадр как тёплая ладонь на плече.",
  "В нём есть спокойствие, которое хочется сохранить для трудных дней.",
  "Момент стал воспоминанием, а воспоминание стало домом.",
  "Здесь любовь выглядит естественно, потому что ей не нужно стараться.",
  "Кадр оставил нам немного того дня, чтобы он не исчез полностью.",
  "В нём тихо живёт наше общее настроение.",
  "Это фотография про близость, которую не измерить расстоянием.",
  "Всё важное здесь случилось между словами.",
  "Фото сохранило мягкий след того, как нам было хорошо.",
  "Здесь память стала почти осязаемой.",
  "Этот кадр хочется смотреть не глазами, а сердцем.",
  "В нём есть маленькое счастье, которое оказалось большим.",
  "Такая минута не повторяется, но остаётся рядом.",
  "Фото бережно держит то, что словами можно только приблизить.",
  "Здесь день стал красивым без причины, кроме одной: мы были вместе.",
  "Кадр напоминает, что нежность часто прячется в обычном.",
  "В этом свете есть часть нас.",
  "Момент тихо сложился в память и остался там навсегда.",
  "Здесь всё говорит о тепле, даже молчание.",
  "Фото стало маленьким окном туда, где сердце спокойно.",
  "Этот кадр не громкий, зато очень родной.",
  "В нём осталась та самая лёгкость, которую трудно поймать дважды.",
  "Память выбрала этот момент не случайно.",
  "Здесь наше время стало немного вечным.",
  "Фото сохранило паузу, в которой было достаточно всего.",
  "В нём живёт светлый кусочек нашего общего пути.",
  "Этот кадр хочется оставить открытым подольше.",
  "Здесь обычная секунда стала нашей маленькой драгоценностью.",
  "Воспоминание получилось тихим, но очень тёплым.",
  "Фото бережёт то, что сердце узнало сразу.",
  "Этот момент словно шепчет: всё было не зря.",
  "Здесь осталось чувство, к которому приятно возвращаться.",
  "Кадр не просит объяснений, он просто рядом.",
  "В нём наша история выглядит особенно нежной.",
  "Маленький фрагмент света, который мы сохранили вместе.",
  "Фото стало доказательством того, что счастье бывает очень тихим.",
  "Здесь всё кажется настоящим до последней детали.",
  "Этот кадр держит внутри не день, а ощущение.",
  "В нём есть тепло, которое невозможно случайно подделать.",
  "Память оставила этот момент на видном месте.",
  "Фото возвращает туда, где всё было мягко и правильно.",
  "Здесь наша история стала чуть светлее.",
  "Этот кадр — маленькая причина улыбнуться снова.",
  "В нём осталось много нежности и совсем немного времени.",
  "Момент стал фотографией, чтобы мы могли не отпускать его сразу.",
  "Здесь любовь просто есть. Этого достаточно.",
  "Фото хранит то, что не хочется терять.",
  "Этот кадр похож на тихое спасибо тому дню.",
  "В нём всё ещё живёт наше тогда.",
  "Здесь память светится изнутри.",
  "Кадр, который бережно держит нас рядом.",
  "В этой минуте было больше тепла, чем кажется.",
  "Фото стало маленьким сердцем нашей истории."
];

let photos = createPlaceholders(24);
let currentIndex = 0;
let effectsEnabled = true;
let soundOn = false;
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
  lightboxImage: document.getElementById("lightboxImage"),
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
  return shuffledFrom(captions, count);
}

function shuffledStoryNotes(count) {
  return shuffledFrom(storyNotes, count);
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
}
async function updateLightbox() {
  const p = photos[currentIndex];
  els.lightboxImage.src = await decryptPhotoUrl(p, "full");
  els.lightboxImage.alt = p.name;
  els.lightboxCaption.textContent = p.caption;
  els.lightboxCounter.textContent = `${currentIndex + 1} / ${photos.length}`;
}
function closeLightbox() {
  els.lightbox.close();
  document.body.style.overflow = "";
}
function moveLightbox(delta) {
  currentIndex = (currentIndex + delta + photos.length) % photos.length;
  updateLightbox();
}
document.getElementById("lightboxClose").onclick = closeLightbox;
document.getElementById("lightboxPrev").onclick = () => moveLightbox(-1);
document.getElementById("lightboxNext").onclick = () => moveLightbox(1);
els.lightbox.addEventListener("click", e => { if (e.target === els.lightbox) closeLightbox(); });
let lightboxTouchStartX = 0;
let lightboxTouchStartY = 0;
els.lightbox.addEventListener("touchstart", e => {
  const touch = e.changedTouches[0];
  lightboxTouchStartX = touch.clientX;
  lightboxTouchStartY = touch.clientY;
}, { passive: true });
els.lightbox.addEventListener("touchend", e => {
  const touch = e.changedTouches[0];
  const dx = touch.clientX - lightboxTouchStartX;
  const dy = touch.clientY - lightboxTouchStartY;
  if (Math.abs(dx) > 54 && Math.abs(dx) > Math.abs(dy) * 1.35) {
    moveLightbox(dx > 0 ? -1 : 1);
  }
}, { passive: true });
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
renderAll();
tryRememberedUnlock();
