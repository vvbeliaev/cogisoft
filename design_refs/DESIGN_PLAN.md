# Cogito Software — Design Identity Plan

> Микс из 5 design-систем: **Vercel, IBM, Anthropic, Linear, Raycast**
> Референсы лежат в корне: [VERCEL.md](VERCEL.md), [IBM.md](IBM.md), [ANTHROPIC.md](ANTHROPIC.md), [LINEAR.md](LINEAR.md), [RAYCAST.md](RAYCAST.md)

---

## 0. Откуда мы стартуем

**Текущее состояние** ([src/styles/global.css](src/styles/global.css)):
- Display: Outfit, Mono: IBM Plex Mono, **body тоже mono** — необычно, даёт «терминальный» тон
- Primary: sky-blue `oklch(60% 0.18 240)` — generic tech
- Headings uppercase + letter-spacing 0.02em
- Radius 0.25rem, depth 0, без теней — «instrument panel»
- Утилиты `panel-industrial`, `bg-scanlines`, `led-indicator`, `card-riveted`, `bg-grid-tech` — уклон в hardware/terminal

**Позиционирование бренда** ([src/pages/index.astro](src/pages/index.astro)):
- «Cogito Software | No Useless Software»
- «We build useful apps»
- «Architectural purity + full code ownership → technical freedom»

**Проблема**:
1. Sky-blue + generic sans = невозможно отличить от любого dev-агентства
2. Mono на body отлично для «терминала», но убивает editorial/«cogito»-голос
3. Нет единой логики теней, глубины, ритма секций
4. DaisyUI-темы настроены на цвета, но не на типографический крафт (Vercel-tracking, IBM-micro-tracking, Linear 510-weight)

---

## 1. Зачем именно эти 5 компаний

Каждая закрывает ровно одну роль. **Никакой подмены между ролями** — иначе получится каша.

| # | Компания | Роль | Что УНИКАЛЬНОГО мы забираем |
|---|----------|------|------------------------------|
| 1 | **VERCEL** | Инженерный скелет | Shadow-as-border (`0 0 0 1px rgba(0,0,0,0.08)`) вместо CSS border · aggressive negative tracking (-2.4px на 48px) · three-weight system (400/500/600) · whisper-thin depth |
| 2 | **IBM** | Типографический базис | IBM Plex Sans **Light 300** на display · micro-tracking 0.16px/0.32px на 14/12px · `--cds-*`-стиль токенов · background-layering вместо теней |
| 3 | **ANTHROPIC** | Тон, тепло, editorial голос | Parchment `#f5f4ed` вместо белого · **Serif 500 для заголовков** · warm-only neutrals (olive/stone/charcoal) · Terracotta `#c96442` как единственный хроматический акцент · ring shadows вместо drop shadows |
| 4 | **LINEAR** | Моушен, dark-mode, техничность | Weight 510 (between-weight) · OpenType `cv01, ss03` · Inter Variable · surface elevation через `rgba(255,255,255,0.02→0.05)` в тёмной теме · command-palette паттерн |
| 5 | **RAYCAST** | Character, delight, device feel | **Positive tracking +0.2px на body** в тёмной теме · macOS-native multi-layer shadows с inset highlights · keyboard key caps · opacity-hover вместо color-hover · warm glow accent |

---

## 2. «Cogito» — синтез в одном абзаце

> **Cogito Software — это IBM Plex в роли бумаги, на которую Anthropic пишет эссе, а Vercel и Linear расставляют структурные метки. Raycast добавляет физику устройства.**

Editorial parchment (Anthropic) + engineering grid (Vercel/IBM) + between-weight technical voice (Linear) + device-like depth (Raycast). Это мост между «мы думаем» (Anthropic) и «мы собираем» (Vercel/Linear/Raycast) — точно то, что говорит слоган «No Useless Software».

---

## 3. Ключевые решения микса

### 3.1 Две темы, два настроения — но одна логика

| | LIGHT (default) | DARK |
|---|---|---|
| **Базовый слой** | Anthropic Parchment `#f5f4ed` | Linear Marketing Black `#08090a` |
| **Текст primary** | Anthropic Near Black `#141413` | Linear `#f7f8f8` |
| **Текст secondary** | Olive Gray `#5e5d59` | Linear Silver `#d0d6e0` |
| **Border** | Vercel shadow-border `0 0 0 1px rgba(20,20,19,0.08)` | Linear semi-white `rgba(255,255,255,0.08)` |
| **Surface lift** | Ivory `#faf9f5` (Anthropic) | `rgba(255,255,255,0.02→0.05)` (Linear) |
| **Accent** | Terracotta `#c96442` (Anthropic) | Terracotta `#c96442` — **тот же**, единственный хроматический цвет в обеих темах |
| **Focus ring** | Vercel Focus Blue `hsla(212,100%,48%,1)` | Linear Violet `#7170ff` |
| **Код-блок** | Raycast key-cap gradient `#121212→#0d0d0d` | Linear panel `#0f1011` + white border 0.08 |

**Логика**: смена темы — это смена «комнаты», но не смена бренда. Terracotta остаётся якорем.

### 3.2 Типографический стек — главный отстрой

Сейчас: Outfit + IBM Plex Mono. **Меняем на триаду**:

```
Display  → IBM Plex Serif (вес 500, light-italic для оттенков)  [IBM × ANTHROPIC]
UI/Body  → IBM Plex Sans   (веса 300, 400, 510, 600)             [IBM × LINEAR]
Code/Label → IBM Plex Mono (веса 400, 500)                        [IBM × VERCEL]
```

Почему именно это:
- **IBM Plex Serif на H1/H2** — это главный unexpected move. Никакое dev-агентство так не делает. Он даёт «cogito» (думать) буквально шрифтом.
- **Plex Sans с весом 510** — заимствуем из Linear (OpenType variable). IBM Plex Variable поддерживает произвольные веса → получаем Linear-подобный «between-weight» на IBM-основе.
- **Единое семейство Plex** — одна гарнитура в трёх ролях. Это IBM-дисциплина: меньше файлов, больше согласованности. Плюс Plex уже стоит в `package.json`.
- **OpenType**: включаем `"liga", "ss03"` глобально (как Vercel и Linear) + `"tnum"` на числа.

**Display tracking scale** (Vercel-inspired, но смягчённый под серифы):

| Size | Weight | Letter-spacing | Источник |
|------|--------|----------------|----------|
| 72–96px (hero) | Serif 500 | -1.0px (softer than Vercel's -2.4) | Anthropic breathing + Vercel compression |
| 48px (section) | Serif 500 | -0.8px | Vercel-lite |
| 32px (sub) | Sans 510 | -0.7px | Linear |
| 24px (card) | Sans 600 | -0.4px | Vercel |
| 16px (body) | Sans 400 | 0 | IBM |
| 14px (caption) | Sans 500 | +0.16px | **IBM micro-tracking** |
| 12px (label) | Mono 500 UPPER | +0.32px | **IBM micro-tracking × Vercel mono labels** |

Серийфные заголовки получают менее агрессивный tracking чем у Vercel, потому что у серифа другая оптика — слишком тесные серифные надписи становятся нечитаемыми.

### 3.3 Цветовая система — minimal chromatic

```
Terracotta  #c96442  ← единственный brand color (Anthropic)
Warm Silver #d1cfc5  ← hover ring (Anthropic)
Focus Blue  #0f62fe  ← keyboard focus only (IBM × Vercel). Не декоративный.
Error       #b53333  ← только для error states (Anthropic warm red)
Success     #24a148  ← только для status dots (IBM)
```

**Запрет**: никакого sky-blue в UI chrome (убираем текущий `oklch(60% 0.18 240)` как primary). Blue живёт только в focus ring и в syntax highlighting кода. Это даёт простор Terracotta быть узнаваемым.

### 3.4 Depth / Elevation — три уровня, не больше

Берём IBM-философию (depth через background layering, минимум теней), но дополняем Vercel/Anthropic ring shadows для интерактивных состояний:

| Level | LIGHT | DARK | Когда |
|---|---|---|---|
| **0 Flat** | Parchment `#f5f4ed` | Marketing `#08090a` | Страница, текст |
| **1 Surface** | Ivory `#faf9f5` | `rgba(255,255,255,0.02)` | Карточки, панели |
| **2 Ring** | Vercel shadow-border | Linear `rgba(255,255,255,0.08)` border | Интерактивные элементы |
| **3 Raised** | Anthropic whisper `rgba(0,0,0,0.05) 0 4px 24px` | Raycast double-ring + warm glow | Только modal / command palette |

**Никаких generic drop-shadows**. Никаких blur-bg decorations вроде текущих `-top-20 w-72 bg-primary/10 rounded-full blur-3xl` — это сегодня главный визуальный шум на главной.

### 3.5 Radius — строгая система, не ad hoc

IBM фундаментально 0px. Anthropic — 8–32px. Это противоречие. Решение: **0px становится значением по умолчанию для функциональных элементов**, a мягкие радиусы — только для editorial карточек и hero-контейнеров.

```
0px    — кнопки, инпуты, code-window, nav bar     [IBM]
6px    — вторичные элементы, tag-pills небольшие  [Vercel]
8px    — стандартные карточки                      [Linear]
16px   — featured cards                             [Anthropic]
9999px — только badges и статус-пиллы              [Vercel/IBM exception]
```

Текущий `--radius-box: 0.25rem` (4px) — это «половина от ничего». Заменить на честный 0px для кнопок и 8px для карточек — и разница в характере будет ощутима немедленно.

### 3.6 Motion — Linear-школа

- Длительность: 150ms (micro), 200ms (standard), 400ms (section reveal)
- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)` — он уже есть в `animate-in`, оставляем
- **Hover = opacity shift (0.6)** как у Raycast, а не цвет
- Scroll: Lenis уже подключён → добавить GSAP ScrollTrigger для stagger-reveal заголовков
- Focus: 2px outline как у Vercel/IBM, без «glow»

### 3.7 Character primitives — 4 штуки

Это те самые мелочи, которые отличают site-as-product от site-as-brochure:

1. **Monospace section labels**: `— 01 / thinking`, `— 02 / building` (Vercel × IBM × Raycast)
2. **Keyboard shortcut keys в документации**: Raycast-style gradient caps для `⌘ K`, `/` и т.п. — сейчас у нас уже есть код-окно, добавим key caps в hero
3. **Command palette (⌘K)**: Linear-паттерн. Svelte-компонент с fuzzy search по страницам/статьям
4. **Editorial pull-quotes** с IBM Plex Serif в блоге и на About: тёплая курсивная «цитата как в книге» на Parchment

Последние два — это то, что переводит сайт из «визитки» в «маленький продукт». Именно этого ждёшь от бренда «we build useful apps».

### 3.8 Что СОЗНАТЕЛЬНО НЕ берём

| Что отбрасываем | Почему |
|---|---|
| Vercel Ship Red / Preview Pink / Develop Blue | Три акцента — это pipeline Vercel. Нам одного Terracotta достаточно. |
| Anthropic hand-drawn illustrations | Дорого, долго, легко превращается в cringe. Вместо них — чистые Lucide иконки (уже установлены) + code-window. |
| IBM rectangular 0px на всём | Жёстко, корпоративно, холодно. Смягчаем 8/16px на карточках. |
| Linear dark-only | Cogisoft — B2B консалтинг, клиенты смотрят с рабочего ноута в офисе. LIGHT должна быть default. |
| Raycast neon red stripes | Это Raycast. Если скопировать — выглядит как «мы хотели быть Raycast». Берём только depth-систему и микро-крафт. |
| Текущие `bg-scanlines`, `led-indicator`, `card-riveted`, `rivet-accent` | Industrial-panel эстетика противоречит editorial-тону Anthropic-слоя. Удалить. |
| Текущий `btn-glow` с gradient animation | Generic SaaS. Заменить на Vercel dark pill. |
| Текущий `glass-panel`, `glass-card` | Backdrop-blur glassmorphism — уведёт в Framer-SaaS-территорию. Удалить. |

---

## 4. Практический план реализации — 5 фаз

Каждая фаза — отдельная PR-ная единица. После каждой можно остановиться и оценить.

### Фаза 1 — Tokens & Typography (фундамент)
**Цель**: изменить базу так, чтобы остальные компоненты автоматически подтянулись.

Файлы:
- [package.json](package.json): добавить `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-serif`; удалить `@fontsource/outfit`, `@fontsource/space-grotesk`, `@fontsource/space-mono`
- [src/styles/global.css](src/styles/global.css):
  - Заменить импорты шрифтов на Plex Sans/Serif/Mono
  - Переписать DaisyUI `LIGHT` theme: base-100 → Parchment, primary → Terracotta
  - Переписать DaisyUI `DARK` theme: base-100 → Marketing Black, primary → Terracotta
  - `--font-display` → IBM Plex Serif, `--font-sans` → IBM Plex Sans, `--font-mono` → IBM Plex Mono
  - `body { font-family: var(--font-sans); }` (сейчас mono — убрать)
  - H1-H6: убрать uppercase + letter-spacing 0.02em, заменить на serif + tracking scale из §3.2
  - Добавить `@theme` кастомные утилиты `track-display`, `track-hero`, `track-section` с правильным letter-spacing
  - Глобально: `font-feature-settings: "liga", "ss03", "tnum"`
- **Удалить** утилиты: `btn-glow`, `glass-panel`, `glass-card`, `glass`, `panel-industrial`, `bg-scanlines`, `bg-vignette`, `led-indicator`, `bg-brushed`, `inset-slot`, `bg-grid-tech`, `text-magic`, `card-riveted`, `rivet-accent`

Acceptance: сайт открывается, шрифт — Plex Serif на H1, Plex Sans на body, фон parchment, primary button — terracotta. Никаких glass/glow/scanlines.

---

### Фаза 2 — Depth, borders, radius
**Цель**: привести все поверхности к shadow-as-border логике.

Файлы:
- [src/styles/global.css](src/styles/global.css):
  - Добавить утилиты `ring-border`, `ring-border-dark`, `surface-1`, `surface-2`, `raised-whisper`
  - Заменить `--radius-box: 0.25rem` на системные значения: `--radius-sm: 0`, `--radius-md: 8px`, `--radius-lg: 16px`, `--radius-pill: 9999px`
  - `--depth: 0` → оставить, но ввести `raised-whisper` как отдельную утилиту для редких плавающих элементов
- Кнопки DaisyUI:
  - Primary CTA → `background: terracotta, color: ivory, radius: 0, padding: 14px 24px` (IBM × Anthropic)
  - Secondary → shadow-as-border ghost (Vercel pattern)

Acceptance: все карточки используют `ring-border`, все кнопки квадратные или 8px, теней-блобов больше нет.

---

### Фаза 3 — Hero и главная ([src/pages/index.astro](src/pages/index.astro))
**Цель**: переверстать герой под новую систему.

- Убрать blur-круги `-top-20 w-72 bg-primary/10 rounded-full blur-3xl animate-pulse`
- Заменить `We build useful apps.` на IBM Plex Serif 96px weight 500 tracking -1.0px
- Подзаголовок: Plex Sans 20px 400 line-height 1.6 (Anthropic editorial breathing)
- Метки `— 01 / thinking` сверху секций (Plex Mono 12px uppercase +0.32px)
- CTA «Book a Call» → Terracotta 0-radius с Vercel focus ring
- CTA «Contact Me» → ghost с shadow-as-border
- [src/components/CodeWindow.astro](src/components/CodeWindow.astro): стилизовать под Raycast window chrome (gradient top bar, double-ring shadow, rounded 12px)

Acceptance: первый экран читается как «warm editorial tech», не как «generic SaaS dark-theme».

---

### Фаза 4 — Command Palette + key caps
**Цель**: добавить character-слой.

- Новый Svelte-компонент `src/components/CommandPalette.svelte`:
  - Trigger: `⌘K` / `Ctrl+K` / `/`
  - Linear-style modal: `rgba(255,255,255,0.02)` bg в dark / Ivory в light, 12px radius, multi-layer shadow
  - Fuzzy поиск по pages + blog posts
  - Клавиатурная навигация ↑↓ Enter
- Key cap компонент `src/components/Kbd.astro`:
  - Raycast gradient `#121212 → #0d0d0d`, 5-layer shadow, 4px radius, Plex Mono 12px 600
  - Использовать в hero и в навигации

Acceptance: нажатие `⌘K` открывает палитру, работает keyboard nav.

---

### Фаза 5 — Blog / Labs editorial pass
**Цель**: раскрыть Anthropic-слой на long-form контенте.

- [src/pages/blog](src/pages/blog) и [src/pages/labs](src/pages/labs):
  - `.prose` переопределить: `--tw-prose-body: IBM Plex Sans 17px line-height 1.6`
  - `.prose h1, h2` → IBM Plex Serif 500
  - Добавить `.prose blockquote` как pull-quote: Serif italic, left border terracotta 2px, padding 24px
  - Код-блоки: Raycast key-cap style для inline `<code>`, Linear-panel style для `<pre>`
- Alternate светлые/тёмные секции по типу Anthropic (но сдержанно — 1–2 переключения на статью максимум)

Acceptance: блог ощущается «как эссе на Anthropic», но с Cogisoft'овскими code-блоками.

---

## 5. Проверка «это точно Cogisoft, а не клон?»

После каждой фазы проверяем по 5 критериям:

| Проверка | Ожидание |
|---|---|
| **Lineage-тест**: можно ли назвать один бренд, которому сайт максимально похож? | Нет. Если кто-то говорит «это копия Anthropic» или «это копия Linear» — провал. |
| **Terracotta-тест**: встречается ли оранжевый хоть в одном не-интерактивном месте? | Нет. Terracotta только на CTA, ссылках, active states. |
| **Serif-тест**: H1 и H2 в IBM Plex Serif 500? | Да. Это главный отстрой — не компромиссничать. |
| **Cool-gray-тест**: есть ли хоть один `rgb(100, 116, 139)` / cool slate в LIGHT-теме? | Нет. В LIGHT все нейтрали warm (olive/stone). В DARK — cool Linear (`#d0d6e0`), это ок. |
| **Blob-тест**: остались ли где-то размытые цветные круги (blur-3xl bg-primary/10)? | Нет. Удалены все. |

---

## 6. Риски и открытые вопросы

1. **IBM Plex Serif может оказаться слишком «официальным»**. Если на превью H1 в Serif выглядит как «госсайт» — откатываемся на **Anthropic Serif fallback → Georgia** либо пробуем GT Sectra / Source Serif Pro. Решаем после Фазы 1.
2. **Terracotta `#c96442` на code-window**. В dark теме может конфликтовать с syntax highlighting. Запасной план: использовать терракоту только на UI chrome, а в коде — стандартную Linear-палитру.
3. **Book a Call → Cal.com**. Cal.com iframe обычно ломает warm background. План: открывать в новом окне (как сейчас), не встраивать.
4. **DaisyUI vs custom tokens**. DaisyUI хорошо работает с oklch, но наш микс использует точные hex из референсов. Возможно придётся писать больше утилит поверх DaisyUI вместо того, чтобы полагаться на его theme system. Решение после Фазы 1.
5. **Есть ли уже контент-макет для blog editorial pass?** Если нет, Фаза 5 может быть преждевременной — пропускаем её до момента, когда будет что верстать.

---

## 7. Что ждём от тебя перед стартом

Прежде чем начинать Фазу 1, подтверди или скорректируй:

1. ✅ / ❌ **Parchment `#f5f4ed` вместо белого** — это самое заметное изменение. Если клиенты Cogisoft ждут «строгую IT-студию» — parchment может быть слишком тёплым.
2. ✅ / ❌ **Terracotta `#c96442` вместо sky-blue** как единственный brand color.
3. ✅ / ❌ **IBM Plex Serif на заголовках** — или попробуем альтернативу (Source Serif, GT Sectra) ?
4. ✅ / ❌ **Удаление industrial-утилит** (`bg-scanlines`, `led-indicator`, `card-riveted`, `rivet-accent`). Они сейчас где-то используются — если да, придётся либо мигрировать компоненты, либо оставить как legacy на `/labs`.
5. **Масштаб**: делаем все 5 фаз или останавливаемся после Фазы 1–2 и смотрим?

Как только подтвердишь — начинаю с Фазы 1.
