# Project Tree And File Guide

## Latest Module Additions

These files were added during the latest cleanup pass:

```text
assets/
├── site.webmanifest
├── css/
│   ├── styles.css
│   ├── base.css
│   ├── layout.css
│   ├── lock.css
│   ├── gallery.css
│   ├── lightbox.css
│   └── responsive.css
└── js/
    ├── app.js
    ├── freshness.js
    └── lightbox-utils.js
```

| File | What it does | Why it helps |
| --- | --- | --- |
| `assets/site.webmanifest` | Describes the site for mobile home-screen installation. | Gives the saved site a proper name, theme color, and large icons. |
| `assets/css/styles.css` | Small entry file with versioned imports for all CSS modules. | Keeps cache-busting centralized after splitting CSS. |
| `assets/css/base.css` | Stable visual base moved from the old single stylesheet. | Preserves the existing design while the CSS is being split safely. |
| `assets/css/layout.css` | Shared page layout and render-containment rules. | Reduces overflow risk and improves long-page rendering. |
| `assets/css/lock.css` | Lock-screen and password-form refinements. | Keeps the entry screen touch-friendly on mobile. |
| `assets/css/gallery.css` | Gallery/card performance and touch rules. | Makes scrolling and opening photos smoother. |
| `assets/css/lightbox.css` | Acrylic lightbox, shimmer loader, thumbnail rail, and update notice. | Makes photo opening feel responsive and adds quick navigation. |
| `assets/css/responsive.css` | Final mobile/tablet overrides. | Keeps controls usable and centered on small screens. |
| `assets/js/lightbox-utils.js` | Image decode, paint, wait, and animation helper functions. | Starts splitting JS into modules and makes lightbox timing easier to maintain. |
| `assets/js/freshness.js` | Shows an update notice when a newer version is available. | Helps known browsers refresh after GitHub Pages updates without manual cache hunting. |

Проект теперь разложен по назначению: страницы отдельно, публичные ассеты отдельно, скрипты отдельно, документация отдельно, приватные исходники отдельно. В корне оставлены только файлы, которые нужны GitHub Pages для входа на сайт.

## Короткое Дерево

```text
.
├── .gitignore
├── .nojekyll
├── index.html
├── 404.html
├── assets/
│   ├── audio/
│   ├── css/
│   ├── data/
│   ├── encrypted/
│   │   └── photos/
│   ├── fonts/
│   ├── icons/
│   ├── images/
│   │   └── errors/
│   ├── js/
│   └── site-version.json
├── config/
├── docs/
├── pages/
├── scripts/
│   └── windows/
├── tools/
├── private/                  # ignored
│   └── photos/               # ignored
├── .codex-remote-attachments/ # ignored
└── .cache/                    # ignored
```

## Корень

| Файл | Что делает | Польза |
| --- | --- | --- |
| `.gitignore` | Описывает, что нельзя добавлять в Git. | Не дает случайно загрузить приватные фото, временные файлы и кеши. |
| `.nojekyll` | Отключает Jekyll на GitHub Pages. | GitHub Pages отдает файлы как обычный статический сайт. |
| `index.html` | Маленький входной шлюз на `pages/index.html`. | Сохраняет обычную ссылку GitHub Pages без ручного `/pages/`. |
| `404.html` | Маленький шлюз на `pages/404.html`. | GitHub Pages все еще находит 404 в корне, а дизайн живет в папке страниц. |

## pages

```text
pages/
├── index.html
├── 404.html
└── wrong-password.html
```

| Файл | Что делает | Польза |
| --- | --- | --- |
| `pages/index.html` | Основная страница альбома: lock screen, галерея, лайтбокс, финальное сердце. | Главная пользовательская часть подарка. |
| `pages/404.html` | Красивая страница “не найдено”. | Ошибка выглядит как часть истории, а не как технический экран. |
| `pages/wrong-password.html` | Страница неверной секретной фразы. | Не ломает атмосферу сайта при ошибке доступа. |

## assets

```text
assets/
├── audio/
├── css/
├── data/
├── encrypted/
├── fonts/
├── icons/
├── images/
├── js/
└── site-version.json
```

| Папка/файл | Что делает | Польза |
| --- | --- | --- |
| `assets/audio/` | Место для фоновой музыки. | Позволяет добавить песню без изменения кода. |
| `assets/css/` | Стили сайта. | Отвечает за красоту, адаптив, мобильные экраны и лайтбокс. |
| `assets/data/` | JSON с фразами для фото. | Тексты меняются отдельно от кода. |
| `assets/encrypted/` | Публичная зашифрованная версия альбома. | Можно публиковать на GitHub без исходных фото. |
| `assets/fonts/` | Локальные шрифты. | Сайт не зависит от внешних CDN и выглядит стабильно. |
| `assets/icons/` | Иконки вкладки и мобильные иконки. | Сайт выглядит аккуратно во вкладках и на телефонах. |
| `assets/images/` | Обычные публичные изображения интерфейса. | Хранит не приватные картинки оформления. |
| `assets/js/` | JavaScript сайта. | Управляет паролем, расшифровкой, галереей, свайпами и кешем. |
| `assets/site-version.json` | Текущий номер версии сайта. | Помогает браузеру получать свежие обновления после push. |

## assets/audio

```text
assets/audio/
└── PUT_YOUR_SONG_HERE.txt
```

| Файл | Что делает | Польза |
| --- | --- | --- |
| `PUT_YOUR_SONG_HERE.txt` | Подсказка для файла `our-song.mp3`. | Напоминает, как добавить музыку. |

## assets/css

```text
assets/css/
└── styles.css
```

| Файл | Что делает | Польза |
| --- | --- | --- |
| `styles.css` | Все стили: layout, анимации, адаптив, lock screen, галерея, 403/404, лайтбокс. | Один центр управления внешним видом сайта. |

## assets/data

```text
assets/data/
└── story-texts.json
```

| Файл | Что делает | Польза |
| --- | --- | --- |
| `story-texts.json` | Хранит 150 заголовков и 150 маленьких фраз. | Подписи разнообразные и редактируются без правки JS. |

## assets/encrypted

```text
assets/encrypted/
├── album.json
├── manifest.enc
└── photos/
    ├── 0001-full-*.enc
    ├── 0001-thumb-*.enc
    ├── ...
    ├── 0056-full-*.enc
    └── 0056-thumb-*.enc
```

| Файл/группа | Что делает | Польза |
| --- | --- | --- |
| `album.json` | Открытый descriptor: salt, iterations, путь к encrypted manifest. | Сайт знает, как проверить пароль и где искать альбом. |
| `manifest.enc` | Зашифрованный manifest со списком фото. | Без секретной фразы нельзя увидеть состав альбома. |
| `photos/*-full-*.enc` | Зашифрованные полноразмерные фото. | Используются при просмотре фото в лайтбоксе. |
| `photos/*-thumb-*.enc` | Зашифрованные миниатюры. | Ускоряют галерею и сердце из миниатюр. |

Сейчас в `assets/encrypted/photos/` 112 файлов: 56 полноразмерных и 56 миниатюр. Эти файлы генерируются, руками их лучше не трогать.

## assets/fonts

```text
assets/fonts/
├── cormorant-garamond-400.ttf
├── cormorant-garamond-500.ttf
├── cormorant-garamond-600.ttf
├── inter-300.ttf
├── inter-400.ttf
└── inter-500.ttf
```

| Файл | Что делает | Польза |
| --- | --- | --- |
| `cormorant-garamond-*.ttf` | Красивый serif для заголовков. | Дает романтичный, подарочный стиль. |
| `inter-*.ttf` | Читаемый sans-serif для интерфейса. | Мелкий текст и кнопки читаются на любом экране. |

## assets/icons

```text
assets/icons/
├── favicon.ico
├── favicon-32.png
├── favicon-180.png
├── favicon-192.png
└── favicon-512.png
```

| Файл | Что делает | Польза |
| --- | --- | --- |
| `favicon.ico` | Универсальная иконка вкладки. | Работает в старых и новых браузерах. |
| `favicon-32.png` | Маленькая PNG-иконка. | Четкая иконка во вкладке браузера. |
| `favicon-180.png` | Apple touch icon. | Красивое отображение на iPhone/iPad. |
| `favicon-192.png` | Android/PWA icon. | Нормальное отображение на Android. |
| `favicon-512.png` | Большая системная иконка. | Качественные превью там, где нужен большой размер. |

## assets/images

```text
assets/images/
└── errors/
    ├── sad-kitten.png
    └── wrong-password-kitten.png
```

| Файл | Что делает | Польза |
| --- | --- | --- |
| `errors/sad-kitten.png` | Иллюстрация страницы 404. | Ошибка не выглядит чужой. |
| `errors/wrong-password-kitten.png` | Иллюстрация страницы неверного пароля. | Даже отказ доступа остается в стиле подарка. |

## assets/js

```text
assets/js/
├── app.js
└── freshness.js
```

| Файл | Что делает | Польза |
| --- | --- | --- |
| `app.js` | Основная логика: unlock, AES-GCM decrypt, галерея, подписи, лайтбокс, свайпы, сердце. | Делает сайт интерактивным и защищенным. |
| `freshness.js` | Проверяет `site-version.json` и обновляет кеш. | После push браузер быстрее получает свежую версию. |

## config

```text
config/
└── robots.txt
```

| Файл | Что делает | Польза |
| --- | --- | --- |
| `robots.txt` | Сохраненная инструкция для поисковиков. | Документирует noindex-политику; сами страницы также имеют `noindex`. |

## docs

```text
docs/
├── PROJECT_TREE.md
├── RANDOM_REPOSITORY_NAME.txt
└── README.md
```

| Файл | Что делает | Польза |
| --- | --- | --- |
| `PROJECT_TREE.md` | Полная карта структуры проекта. | Быстро показывает, где что лежит и зачем. |
| `README.md` | Инструкция по сборке и публикации. | Помогает вспомнить рабочий процесс. |
| `RANDOM_REPOSITORY_NAME.txt` | Справочная заметка с именем репозитория. | Хранит служебную заметку не в корне. |

## scripts/windows

```text
scripts/windows/
├── BUILD_ENCRYPTED_ALBUM.bat
└── START_GALLERY.bat
```

| Файл | Что делает | Польза |
| --- | --- | --- |
| `BUILD_ENCRYPTED_ALBUM.bat` | Запускает сборку зашифрованного альбома на Windows. | Удобный запуск без ручной команды Python. |
| `START_GALLERY.bat` | Запускает локальный сервер. | Можно проверить сайт перед push. |

## tools

```text
tools/
├── README.md
├── build_encrypted_album.py
├── dev_server.py
└── stamp_site_version.py
```

| Файл | Что делает | Польза |
| --- | --- | --- |
| `build_encrypted_album.py` | Оптимизирует фото, делает thumbnails/full и шифрует AES-256-GCM. | Главная защита личных фотографий перед публикацией. |
| `dev_server.py` | Локальный сервер, похожий на GitHub Pages. | Удобно тестировать маршруты и 404. |
| `stamp_site_version.py` | Обновляет версию ассетов в HTML/JS/JSON. | Борется с кешем браузера после обновлений. |
| `README.md` | Короткая справка по tools. | Помогает быстро понять назначение скриптов. |

## private

```text
private/
└── photos/
```

| Папка | Что делает | Польза |
| --- | --- | --- |
| `private/photos/` | Исходные личные фото до шифрования. | Не публикуется на GitHub; из нее собирается encrypted album. |

## Игнорируемые Служебные Папки

```text
.codex-remote-attachments/
.cache/
```

| Папка | Что делает | Польза |
| --- | --- | --- |
| `.codex-remote-attachments/` | Временные вложения из чата Codex. | Не относятся к сайту и не публикуются. |
| `.cache/` | Локальный временный кеш, включая перенесенный Python `__pycache__`. | Убирает мусор из корня и не попадает в Git. |

## Почему В Корне Остались `index.html` И `404.html`

GitHub Pages ищет главную страницу и кастомную 404 в корне сайта. Поэтому корневые `index.html` и `404.html` оставлены как маленькие redirect-шлюзы. Весь настоящий контент лежит в `pages/`.
