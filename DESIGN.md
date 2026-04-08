# Cogito Software — Design Code

> The canonical design system. What you see here is what is wired into
> [src/styles/global.css](src/styles/global.css) and the primitive components.
> Companion references live in [design/](design/):
> [VERCEL](design/VERCEL.md) · [IBM](design/IBM.md) · [ANTHROPIC](design/ANTHROPIC.md) · [LINEAR](design/LINEAR.md) · [RAYCAST](design/RAYCAST.md) · [DESIGN_PLAN](design/DESIGN_PLAN.md)

---

## 1. The one-line thesis

> **Cogito Software is IBM Plex as the paper, Anthropic writing the essay, Vercel and Linear setting the structural marks, Raycast giving it the feel of a device.**

Every decision below descends from that sentence. Five design systems, five non-overlapping roles:

| Role           | Source                           | What we took                                                            |
| -------------- | -------------------------------- | ----------------------------------------------------------------------- |
| **Skeleton**   | [Vercel](design/VERCEL.md)       | Shadow-as-border (`0 0 0 1px`), tight tracking, three-weight system     |
| **Typography** | [IBM](design/IBM.md)             | Plex family: Serif display + Sans body + Mono labels                    |
| **Tone**       | [Anthropic](design/ANTHROPIC.md) | Parchment canvas, Terracotta accent, exclusively warm neutrals          |
| **Technique**  | [Linear](design/LINEAR.md)       | OpenType `cv01/ss03`, surface elevation through alpha, dark-first craft |
| **Character**  | [Raycast](design/RAYCAST.md)     | macOS-style shadows, ⌘K palette, keycap styling                         |

Anything that doesn't fit one of these five roles is out. No Framer glassmorphism. No Stripe gradients. No Vercel workflow colors. No industrial-panel scanlines.

### Implementation stack

The brand lives in a warm Astro + Svelte 5 site. Component primitives come from **shadcn-svelte** (Lyra preset), styles are pure Tailwind v4 CSS variables, and icons are served by **iconify** through `astro-icon` and `unplugin-icons`.

| Layer | Package | Role |
| --- | --- | --- |
| Framework | `astro@6` + `@astrojs/svelte@8` | Static + SSR shell, islands for interactive Svelte |
| Components | `shadcn-svelte` (Lyra preset, base `neutral`) | Button, Sheet, Command, Dialog, DropdownMenu, Tooltip, etc. — owned code under `src/components/ui` |
| Primitives | `bits-ui` + `melt-ui` (vendored through shadcn) | Accessible headless behavior for the components above |
| Utility classes | `tailwindcss@4` + `tw-animate-css` | Zero DaisyUI — we own the tokens via `global.css` |
| Icons (Astro) | `astro-icon` + `@iconify-json/ph` (+`@iconify-json/carbon`) | `<Icon name="ph:arrow-right" />` in `.astro` files |
| Icons (Svelte) | `unplugin-icons` + same iconify collections | `import ArrowRight from "~icons/ph/arrow-right"` in `.svelte` files |
| Typography | `@fontsource/ibm-plex-serif`, `-sans`, `-mono` + JetBrains Mono fallback from Lyra | The IBM Plex triad, loaded as static subsets |
| Class utils | `clsx`, `tailwind-merge`, `tailwind-variants` | Standard shadcn `cn()` helper in `src/lib/utils.ts` |

**What we explicitly don't ship anymore**: `daisyui`, `@lucide/astro`, `lucide-svelte`. All three were removed during the shadcn migration — do not reintroduce.

---

## 2. Themes

Two rooms, one brand. `LIGHT` is default; `DARK` is the alt. **Terracotta stays the same hue across both** — it's the brand anchor.

### LIGHT — «Parchment Lab»

Warm editorial canvas (Anthropic) on top of an engineering grid (IBM × Vercel). Tokens use the shadcn convention (`--background`, `--foreground`, `--primary`, …) and are mapped into Tailwind via `@theme inline` in [src/styles/global.css](src/styles/global.css).

| Token                   | Value     | Role                                             |
| ----------------------- | --------- | ------------------------------------------------ |
| `--background`          | `#f5f4ed` | **Parchment** — page canvas                      |
| `--card`                | `#faf9f5` | Ivory — cards, popovers, elevated surfaces       |
| `--muted`               | `#e8e6dc` | Warm Sand — inputs, muted containers             |
| `--foreground`          | `#141413` | Anthropic Near Black — primary text              |
| `--primary`             | `#c96442` | **Terracotta** — the only chromatic anchor      |
| `--primary-foreground`  | `#faf9f5` | Ivory text on Terracotta                         |
| `--secondary`           | `#30302e` | Dark Surface — inverted buttons                  |
| `--accent`              | `#e8e6dc` | Neutral accent (hover surfaces)                 |
| `--muted-foreground`    | `#5e5d59` | Olive gray — secondary text                      |
| `--destructive`         | `#b53333` | Anthropic warm red                               |
| `--border`              | `rgba(20,20,19,0.08)` | Vercel shadow-as-border tone        |
| `--ring`                | `#c96442` | Focus ring = brand                               |

Legacy aliases (`--color-base-100`, `--color-base-content`, `--color-primary-content`, `--color-info`, …) are still declared in `@theme inline` so existing `bg-base-100` / `text-base-content` classes keep resolving to the Parchment palette until every call-site is migrated to canonical shadcn names. Treat them as a bridge, not canon.

### DARK — «Linear Foundry»

| Token                  | Value     | Role                                                               |
| ---------------------- | --------- | ------------------------------------------------------------------ |
| `--background`         | `#08090a` | Linear Marketing Black                                             |
| `--card`               | `#0f1011` | Linear Panel                                                       |
| `--secondary`          | `#191a1b` | Linear Level 3                                                     |
| `--muted`              | `#191a1b` | Linear Level 3                                                     |
| `--foreground`         | `#f7f8f8` | Linear primary text (not `#ffffff`)                                |
| `--muted-foreground`   | `#8a8f98` | Linear tertiary gray                                               |
| `--primary`            | `#c96442` | Terracotta — **same as LIGHT**, brand doesn't change between rooms |
| `--ring`               | `#c96442` | Focus ring = brand, same across themes                             |

### Rules

- **Never** use pure white (`#ffffff`) as background. Parchment > White.
- **Never** use pure black (`#000000`). `#141413` or `#08090a`.
- **Never** introduce cool blue/slate grays in LIGHT. Every neutral must be warm-toned (olive/stone/charcoal).
- **Never** use Terracotta decoratively. Only CTAs, links, active states, brand moments.
- Focus Blue is reserved for `:focus-visible` — not for UI chrome, not for syntax highlighting as a brand color.

---

## 3. Typography

The whole system runs on one family — **IBM Plex** — in three roles.

```css
--font-display: "IBM Plex Serif", Georgia, serif;
--font-sans: "IBM Plex Sans", system-ui, -apple-system, sans-serif;
--font-mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
```

Global OpenType features: `"liga", "ss03", "tnum", "kern", "calt"`.

### Scale

All h1/h2 are rendered as `var(--font-display)` — IBM Plex **Serif** at weight 500. All h3–h6 are `var(--font-sans)` weight 600. Body is Plex Sans 400. **Mono is for labels and code, never for body text.**

| Role                       | Font       | Size                                   | Weight | Line height | Tracking       | Notes                      |
| -------------------------- | ---------- | -------------------------------------- | ------ | ----------- | -------------- | -------------------------- |
| `h1`                       | Plex Serif | `clamp(2.75rem, 5.5vw + 1rem, 5.5rem)` | 500    | 1.02        | `-0.03em`      | Hero. Book-title presence. |
| `h2`                       | Plex Serif | `clamp(2rem, 3vw + 1rem, 3.25rem)`     | 500    | 1.1         | `-0.022em`     | Section anchors            |
| `h3`                       | Plex Sans  | `clamp(1.375rem, 1vw + 1rem, 1.75rem)` | 600    | 1.25        | `-0.018em`     | Card titles                |
| `h4`                       | Plex Sans  | `1.25rem`                              | 600    | 1.25        | `-0.012em`     | Feature names              |
| `body`                     | Plex Sans  | `1rem`                                 | 400    | 1.5         | normal         | Default reading            |
| `body-editorial` (utility) | Plex Sans  | `1.0625rem`                            | 400    | 1.6         | normal         | Long-form, intros          |
| `label-mono` (utility)     | Plex Mono  | `0.75rem`                              | 500    | —           | `0.12em` UPPER | Section meta-labels        |
| code (prose)               | Plex Mono  | `0.9rem`                               | 400    | 1.6         | normal         | Code blocks                |

### Tracking philosophy

Vercel uses `-2.4px` at 48px. That works for sans — on serifs it crushes the letterforms. We use a softer scale:

```css
--tracking-hero: -0.03em; /* hero display */
--tracking-display: -0.022em; /* section h2 */
--tracking-section: -0.018em; /* h3 */
--tracking-card: -0.012em; /* h4 */
--tracking-micro: 0.02em; /* IBM positive tracking for 12–14px labels */
```

Negative tracking on serifs is intentional but softer. Positive tracking on tiny mono labels (Raycast × IBM) is what gives them the "engineered label" feel.

### Headline rule

**Headlines never carry `text-transform: uppercase`.** The current global.css used to do this — removed. Only `label-mono` is UPPER, because mono + UPPER is the signature Vercel/IBM engineering meta-label pattern.

---

## 4. Depth system

Three levels. Everything else is a hack.

| Level           | Utility           | LIGHT                                                          | DARK                                                             | When                                      |
| --------------- | ----------------- | -------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------- |
| **0 — Flat**    | (none)            | Parchment page                                                 | Marketing Black page                                             | Page, inline text                         |
| **1 — Surface** | `.surface-lift`   | Ivory bg + `0 0 0 1px rgba(20,20,19,0.08)`                     | `rgba(255,255,255,0.02)` bg + `0 0 0 1px rgba(255,255,255,0.08)` | Cards, panels, nav surfaces               |
| **2 — Ring**    | `.ring-border`    | `0 0 0 1px rgba(20,20,19,0.08), 0 2px 2px rgba(20,20,19,0.04)` | `0 0 0 1px rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.4)`    | Interactive containers                    |
| **3 — Raised**  | `.raised-whisper` | `0 0 0 1px + 0 4px 24px rgba(0,0,0,0.05)`                      | multi-layer with `rgba(255,255,255,0.03)` inset                  | Command palette, modals, hero code-window |

**Rules**:

- No CSS `border` on cards. Use `surface-lift` or `ring-border` — the shadow IS the border (Vercel signature).
- No generic `shadow-xl`, `shadow-2xl` from Tailwind presets. Only the three levels above.
- No blurred color blobs (`blur-3xl bg-primary/10`). They are banned.
- Raycast-style multi-layer button shadows (`.btn-glass`) exist but are reserved for dark-theme hero CTAs only.

---

## 5. Radius

IBM says 0px. Anthropic says 8–32px. We reconcile:

```css
--radius-sharp: 0px; /* default — buttons, inputs, nav, most surfaces */
--radius-card: 8px; /* standard cards when softness helps */
--radius-editorial: 16px; /* featured cards, hero code-window */
--radius-pill: 9999px; /* badges and status pills only */
```

**Default is 0px.** Only soften when the content is editorial (pull-quote, hero image, command palette). Rectangular is the engineering voice; rounded is the warmth — use the latter sparingly.

---

## 6. Motion

One easing curve: `cubic-bezier(0.2, 0.8, 0.2, 1)`.

| Duration | Use                                    |
| -------- | -------------------------------------- |
| `120ms`  | Button press (transform)               |
| `180ms`  | Color/opacity (hover, focus)           |
| `400ms`  | Image scale, card reveal               |
| `600ms`  | Page/section `fade-up` (`.animate-in`) |

### Hover is opacity, not color

Raycast signature. **All `.btn` on hover shifts to `opacity: 0.88`**, not a different background color. The brand stays constant; only the energy changes. This is wired in `global.css`:

```css
.btn:hover:not(:disabled) {
  opacity: 0.88;
}
.btn:active:not(:disabled) {
  transform: translateY(1px);
}
```

Links and cards follow the same rule (`hover:opacity-90`, `hover:opacity-95`).

---

## 7. Components & primitives

### Component layer — shadcn-svelte

All interactive UI primitives come from **shadcn-svelte** (Lyra preset, `neutral` base color), installed to [src/components/ui](src/components/ui) as owned source. That means every shadcn component is yours to edit in-place — no upstream hell.

Currently installed: `button`, `sheet`, `dropdown-menu`, `command`, `dialog`, `input`, `textarea`, `label`, `tooltip`, `badge`, `separator`, `avatar`, `alert`, `tabs`, `accordion`, `hover-card`, `skeleton`, `sonner`, `input-group`.

Rules for using them:

- **Interactive controls go through `$components/ui/*`.** If you need a button with state, a dropdown, a sheet, a dialog, a command palette — use the shadcn component, not ad-hoc markup.
- **shadcn styles read from our tokens.** `Button` uses `bg-primary text-primary-foreground`, which is already wired to Terracotta × Ivory in [src/styles/global.css](src/styles/global.css). Don't override these classes per-usage.
- **Lyra preset chose `rounded-none` and compact sizing** — perfect match for our IBM 0px-radius philosophy. Don't reintroduce rounded corners on shadcn components.
- **Astro hydration**: shadcn Svelte components need a hydration directive when used inside `.astro` pages (`client:load`, `client:idle`, etc.). For framework-agnostic primitives on static pages (like an anchor styled as a button), use a plain `<a class="btn btn-primary">` with our legacy aliases.

### Buttons

Two paths, depending on context:

1. **Static CTA in `.astro` files** — use the legacy `.btn` / `.btn-primary` / `.btn-ghost` / `.btn-glass` classes. They're declared as Tailwind utilities in `global.css` and styled with our tokens. This avoids forcing hydration for a plain anchor.
2. **Interactive button inside a `.svelte` component** — use `<Button>` from `$components/ui/button`. Variants: `default | outline | secondary | ghost | destructive | link`. Sizes: `default | xs | sm | lg | icon | icon-xs | icon-sm | icon-lg`. Override height/padding with `class="h-12 px-8 text-[15px]"` when you need the marketing CTA size.

Static button recipes:

| Variant                      | Background  | Text         | Shape                                                    |
| ---------------------------- | ----------- | ------------ | -------------------------------------------------------- |
| `btn btn-primary`            | Terracotta  | Ivory        | `0px` radius, padding `px-8 h-12 min-h-0`                |
| `btn btn-ghost`              | transparent | foreground   | `0px` radius, `inset 0 0 0 1px rgba(20,20,19,0.12)` ring |
| `btn btn-glass` (dark hero)  | translucent | white        | multi-layer Raycast shadow                               |

**Rules**:

- `px-8 h-12 min-h-0 text-[15px]` is the standard hero/CTA size. Don't use shadcn's `size="lg"` which is only `h-9`.
- No box-shadow on `.btn-primary`. Vercel says flat terracotta is enough.
- No `shadow-primary/20` glow. Removed.
- Hover is always `opacity: 0.88`, never a color change. Wired globally in `.btn:hover`.

### `SectionLabel` — mono meta-labels

The Vercel × IBM × Raycast signature. Every major section starts with one.

```astro
<SectionLabel index="01" text="thinking" accent />
<h2>Core competencies</h2>
```

Renders as:

```
— 01 / THINKING
```

at 12px IBM Plex Mono weight 500, uppercase, `0.12em` tracking. When `accent={true}`, it takes Terracotta color; otherwise it's a muted warm gray (50% of base-content).

This label pattern is **the strongest brand signal on the page** besides the serif headlines. Use it liberally — at the top of every section, every hero, every blog post.

### `Kbd` — Raycast keycap

```astro
<Kbd label="⌘" /> <Kbd label="K" />
```

Physical gradient `#faf9f5 → #e8e6dc` (LIGHT) or `#121212 → #0d0d0d` (DARK), 4-layer inset shadow simulating a mechanical key press. 4px radius. Plex Mono 12px.

Reserved for actual keyboard affordances (⌘K hint, ESC, ↑↓). **Never** decorative.

### `CommandPalette` — Linear × Raycast ⌘K (shadcn `Command.Dialog`)

- Triggered by `⌘K` / `Ctrl+K`, by any element with `data-command-palette-trigger`, or by dispatching `window.dispatchEvent(new CustomEvent("cogito:open-palette"))`.
- Built on `$components/ui/command`'s `Command.Dialog` — inherits fuzzy filtering, keyboard nav, focus trap, and accessibility out of the box.
- Groups: **Navigate** (pages) and **Actions** (contact, book-a-call). Each entry has a Phosphor duotone icon in Terracotta.
- Wired in [src/components/CommandPalette.svelte](src/components/CommandPalette.svelte); globally mounted from [src/layouts/Root.astro](src/layouts/Root.astro) with `client:load`.
- `Header.svelte` has a visible `⌘K` trigger pill — it dispatches `cogito:open-palette` rather than calling the component directly, keeping Header decoupled from palette internals.

### `CodeWindow` — hero device

Raycast window chrome: traffic-light dots, mono title, `raised-whisper` on `surface-lift`, 12px radius. No scanlines, no scanline effect, no gradient tilt, no `rotate-1`. Code is syntax-highlighted with Anthropic warm success-green (`#24a148`/`#10b981`) for strings, Terracotta for class names, Coral for keywords. Uses `label-mono` for the title bar.

### Navigation

- [src/components/Header.svelte](src/components/Header.svelte): sticky, `bg-background/80 backdrop-blur-md`, shadow-as-border bottom (`0 1px 0 rgba(20,20,19,0.08)`). Mounted via `client:load` from Root.
- Nav links: 13px Plex Sans weight 500 — not uppercase, not `tracking-widest`.
- `⌘K Search` pill sits between links and theme controller, dispatches `cogito:open-palette`. Contains actual `<kbd class="kbd-cap">` caps.
- **Mobile drawer uses shadcn `Sheet`** (right side, 85vw max 80). No DaisyUI `drawer`, no Daisy `collapse`.
- Logo wordmark uses **IBM Plex Serif 500** at 0.95rem, with a tiny `label-mono` "own your tech" sub-line underneath. The SVG lives in [src/components/LogoSvg.svelte](src/components/LogoSvg.svelte) (duplicated from `Logo.astro` for Svelte consumption — the Astro version is kept around for legacy `.astro`-only pages).

### Footer

- Single row, no card, no border boxes, no rivets. Just a hairline top edge via shadow-as-border inset.
- Wordmark in Plex Serif, body in `body-editorial`, links in muted warm gray, copyright as `label-mono`.

### Prose (blog)

Configured in `global.css` `.prose` overrides:

- Body: Plex Sans `1.0625rem / 1.65`
- `h1, h2`: Plex Serif 500 with `--tracking-display`
- `h3, h4`: Plex Sans 600 with `--tracking-section`
- `blockquote`: Plex Serif **italic** 400, 2px Terracotta left border, `1.5rem` left padding — the editorial pull-quote pattern
- `pre`: Ivory background, shadow-as-border (no CSS border), 8px radius, Plex Mono
- Links: Terracotta

---

## 8. Icons — Phosphor via Iconify

All icons come from the **Iconify** ecosystem, not Lucide. Phosphor is our primary family, Carbon is the IBM-flavored backup.

### Why

- Phosphor has **6 weights** including **Duotone** — we use duotone for hero / feature icons with Terracotta as the primary fill and a muted warm gray as the secondary fill. That's a brand signal no generic SaaS site has.
- Carbon is literally the IBM family that produced Plex — ideological pair for small UI icons where Phosphor feels too editorial.
- **Build-time SVG compilation** — neither `astro-icon` nor `unplugin-icons` ship `.svelte` files at runtime, so they don't break Astro prerender (unlike `lucide-svelte`, which burned us).

### Usage

**Inside `.astro` files** — via `astro-icon`:

```astro
---
import { Icon } from "astro-icon/components";
---

<Icon name="ph:arrow-right" class="w-4 h-4" />
<Icon name="ph:rocket-launch-duotone" class="w-10 h-10 text-primary" />
<Icon name="carbon:code" class="w-5 h-5" />
```

**Inside `.svelte` files** — via `unplugin-icons`:

```svelte
<script lang="ts">
  import Sun from "~icons/ph/sun-duotone";
  import Command from "~icons/ph/command";
</script>

<Sun class="size-4" />
```

The `~icons/*` path is wired in [astro.config.mjs](astro.config.mjs) via `Icons({ compiler: "svelte" })`. Type definitions come from `unplugin-icons/types/svelte` in [tsconfig.json](tsconfig.json).

### Rules

- **Phosphor duotone for decorative icons** (hero features, cards, empty states). The duotone fill uses `currentColor`, so setting `text-primary` makes the filled part Terracotta while the outline stays muted.
- **Phosphor regular (no suffix) for UI affordances** (arrows, close, menu, chevron). Inside buttons, nav, inline flows.
- **Phosphor filled / brand logos** for social icons (`ph:github-logo-fill`, `ph:linkedin-logo-fill`, `ph:x-logo-fill`).
- **Never mix Phosphor + Carbon in the same viewport region.** If the hero is Phosphor, the feature grid stays Phosphor.
- **No Lucide.** `@lucide/astro` and `lucide-svelte` were removed during the shadcn migration. shadcn-svelte's Lyra preset already uses Phosphor for its internal icons, so there's no need.

---

## 9. Signature primitives cheat-sheet

These are the four things that make a page feel like Cogito and not a template:

1. **Serif H1/H2** — IBM Plex Serif 500, never uppercase, softer negative tracking
2. **Mono section labels** — `— 00 / thinking` at the top of every hero and every section (`SectionLabel` component)
3. **Parchment canvas** — warm `#f5f4ed` instead of white (LIGHT) paired with terracotta CTAs
4. **⌘K + keycaps** — command palette globally available, `Kbd` caps used whenever a keyboard shortcut appears

Drop any of the four and the page starts looking generic.

---

## 10. Explicit don'ts

Things we considered and rejected on purpose — don't reintroduce them without updating this file:

- ❌ **DaisyUI.** Removed entirely during the shadcn migration. `daisyui` is no longer a dependency. The legacy `btn / btn-primary / btn-ghost / btn-outline / btn-circle / btn-sm` utilities in `global.css` are thin aliases on top of shadcn tokens and exist **only** so `.astro` static anchors keep working. Don't confuse that with running DaisyUI — all its themes, components, and radial progress weirdness are gone.
- ❌ **Lucide icons.** `@lucide/astro` and `lucide-svelte` are both uninstalled. Use Phosphor via Iconify instead.
- ❌ `text-transform: uppercase` on headings (was global; removed)
- ❌ `font-display: Outfit / Space Grotesk / Space Mono` (replaced by IBM Plex)
- ❌ Body text in monospace (was the old aesthetic; now Plex Sans)
- ❌ Industrial panel utilities: `card-riveted`, `rivet-accent`, `led-indicator`, `panel-industrial`, `bg-scanlines`, `bg-vignette`, `bg-brushed`, `inset-slot`, `bg-grid-tech`, `bg-noise`, `bg-grid-pattern`, `geometric-lines`
- ❌ `shadow-xl`, `shadow-2xl`, `shadow-primary/20` — use the three-level depth system instead
- ❌ `bg-primary/10 blur-3xl` blobs — banned
- ❌ Sky blue / cyan / neon as primary brand color — replaced by Terracotta
- ❌ Linear violet `#5e6ad2` in LIGHT theme chrome — only exists as DARK `--ring` on focus
- ❌ Vercel workflow colors (Ship Red / Preview Pink / Develop Blue) — those mean something specific in Vercel's pipeline, not our brand
- ❌ Raycast Red (`#FF6363`) — competes with Terracotta, rejected
- ❌ Hand-drawn Anthropic illustrations — out of scope, use Phosphor duotone icons instead
- ❌ Gradient text (`text-transparent bg-clip-text bg-linear-to-r`) — generic SaaS, use Terracotta solid instead.
- ❌ Reaching into `src/components/ui/*` from outside to override shadcn internals with `!important`. If a variant doesn't exist, edit the shadcn file directly (it's our code) or pass extra classes via `class="…"`.

---

## 11. Where things live

| Concern                                       | File                                                                                                                                                                                               |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Theme tokens, utilities, prose, motion, depth | [src/styles/global.css](src/styles/global.css)                                                                                                                                                     |
| Tailwind / icon / svelte plugin wiring        | [astro.config.mjs](astro.config.mjs)                                                                                                                                                               |
| shadcn config (preset Lyra, aliases)          | [components.json](components.json)                                                                                                                                                                 |
| shadcn primitives (owned source)              | [src/components/ui/](src/components/ui/)                                                                                                                                                           |
| `cn()` helper + shared types                  | [src/lib/utils.ts](src/lib/utils.ts)                                                                                                                                                               |
| Ambient canvas layer                          | [src/components/Background.astro](src/components/Background.astro)                                                                                                                                 |
| Sticky header with ⌘K pill + Sheet drawer     | [src/components/Header.svelte](src/components/Header.svelte)                                                                                                                                       |
| Logo SVG (Svelte consumable)                  | [src/components/LogoSvg.svelte](src/components/LogoSvg.svelte)                                                                                                                                     |
| Minimal footer                                | [src/components/Footer.astro](src/components/Footer.astro)                                                                                                                                         |
| Hero code window (Raycast chrome)             | [src/components/CodeWindow.astro](src/components/CodeWindow.astro)                                                                                                                                 |
| Section meta label `— 01 / thinking`          | [src/components/SectionLabel.astro](src/components/SectionLabel.astro)                                                                                                                             |
| Keycap primitive                              | [src/components/Kbd.astro](src/components/Kbd.astro)                                                                                                                                               |
| Theme toggle                                  | [src/components/ThemeController.svelte](src/components/ThemeController.svelte)                                                                                                                     |
| Global ⌘K palette                             | [src/components/CommandPalette.svelte](src/components/CommandPalette.svelte)                                                                                                                       |
| Global layout shell                           | [src/layouts/Root.astro](src/layouts/Root.astro)                                                                                                                                                   |
| Blog article layout (prose + reading rail)    | [src/layouts/Blog.astro](src/layouts/Blog.astro)                                                                                                                                                   |
| Plan document (how we got here)               | [design/DESIGN_PLAN.md](design/DESIGN_PLAN.md)                                                                                                                                                     |
| Raw design-spec references                    | [design/VERCEL.md](design/VERCEL.md) · [design/IBM.md](design/IBM.md) · [design/ANTHROPIC.md](design/ANTHROPIC.md) · [design/LINEAR.md](design/LINEAR.md) · [design/RAYCAST.md](design/RAYCAST.md) |

---

## 12. Known issues & gotchas

1. **Svelte component libraries that ship raw `.svelte`.** Several packages in the shadcn stack (`bits-ui`, `@lucide/svelte`, `svelte-sonner`, `mode-watcher`, `phosphor-svelte`, `@internationalized/date`) distribute uncompiled `.svelte` files. Node's SSR loader cannot parse them, so Astro's prerender phase crashes when it tries to import them directly. Fix: the offending packages are listed in `vite.ssr.noExternal` in [astro.config.mjs](astro.config.mjs) as regexes, which forces Vite to bundle them through the svelte plugin before SSR. If you install a new Svelte library and the build falls over with `Unknown file extension ".svelte"` — add it to that list.
2. **`prebundleSvelteLibraries: true`** is set on the `svelte()` integration to speed up dev mode and keep the SSR pipeline consistent with the build pipeline.
3. **Legacy `magiclink` page** is gone from the codebase; associated `glass-panel / btn-glow / text-magic` utilities were removed from `global.css`. If you ever bring that landing back, restore those utilities as scoped, legacy-only helpers.
4. **Two-file Logo.** `Logo.astro` (Astro version) is still used by server-rendered pages. `LogoSvg.svelte` is a Svelte copy for use inside `.svelte` components (like `Header.svelte`). Keep both in sync when updating the SVG path data.
5. **TS hints in content-collection pages** (labs, blog index) about `unknown` typing on `project.data` / `post.data`. Pre-existing, not caused by the design migration. Astro build ignores them.

---

## 13. Proof test — "is this page Cogito?"

After any new page or refactor, answer these five questions. If any is "no", it's off-brand:

1. Is the background **Parchment `#f5f4ed`** in LIGHT (not white)?
2. Is the first heading **IBM Plex Serif 500**, never uppercase?
3. Is the primary CTA **Terracotta, 0px radius, flat** (no gradient, no glow, no shadow)?
4. Is there at least one **`— NN / label` mono meta-label** at the top of the first section?
5. Are all card surfaces using **`surface-lift` or `ring-border`** (no CSS border, no blur blobs)?

Five yes → it's Cogito. Four or fewer → it's a generic dev-tools template.
