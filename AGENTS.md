# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the main corporate website for Cogito Software, built with **Astro** and **Svelte** components. The project serves as a marketing site and lead generation platform, featuring interactive zero-landings for product validation. It runs as an **Astro SSR** application backed by an embedded **SQLite** database for lead storage and is containerized with Docker.

## Development Commands

### Running the Application

```bash
# Start development server (default port 4321)
pnpm dev

# Build for production
pnpm build

# Run the production server (after build)
pnpm start

# Preview production build
pnpm preview
```

### Docker

```bash
# Local stack (build + run, port 4321)
make dev

# Or directly
docker compose -f compose.local.yml up --build
```

## Architecture

### Tech Stack

- **Astro** (SSR mode): server-rendered pages and API routes
- **Svelte**: Interactive components (via `@astrojs/svelte`)
- **`@astrojs/node`** (standalone): Node.js production runtime
- **SQLite** (`better-sqlite3`): Embedded persistent storage for leads
- **TailwindCSS v4**: Styling via `@tailwindcss/vite`
- **DaisyUI**: Component library

### Project Structure

```
src/
├── components/          # Reusable Astro and Svelte components
│   ├── Header.astro
│   ├── Footer.astro
│   ├── Hero.astro
│   ├── ContactForm.svelte
│   └── ...
├── layouts/             # Page layouts
│   └── Layout.astro
├── pages/               # Astro pages (file-based routing)
│   ├── index.astro
│   ├── contact.astro
│   ├── magiclink/       # Example zero landing
│   │   └── index.astro
│   └── ...
├── actions/             # Astro server actions (RPC over astro:actions)
│   └── index.ts         # createLead action (zod-validated)
├── lib/
│   └── db/              # SQLite layer
│       ├── index.ts     # connection + migrations (lazy init)
│       └── leads.ts     # leads repository
└── styles/
    └── global.css
```

### Backend Integration

The site is server-rendered by Astro with the Node adapter in standalone mode. Lead capture is implemented as an **Astro Action** (`actions.createLead`) defined in `src/actions/index.ts`. The action validates input with `astro:schema` (Zod) and persists records into a local SQLite database via `better-sqlite3`.

**Database location**:

- Configured via the `SQLITE_DB_PATH` env var (default: `./data/cogisoft.db`)
- In Docker, `/data` is exposed as a volume so the DB survives container rebuilds

**`leads` table schema**:

| Column       | Type | Notes                                |
| ------------ | ---- | ------------------------------------ |
| `id`         | INTEGER PRIMARY KEY AUTOINCREMENT |                  |
| `email`      | TEXT NOT NULL                     |                  |
| `name`       | TEXT                              | optional         |
| `message`    | TEXT                              | optional         |
| `experiment` | TEXT                              | landing identifier |
| `meta`       | TEXT                              | JSON-encoded blob |
| `created_at` | TEXT NOT NULL                     | ISO timestamp    |
| `updated_at` | TEXT NOT NULL                     | ISO timestamp    |

Migrations run automatically on first connection (`getDb()` in `src/lib/db/index.ts`).

### Analytics and Tracking

- **Posthog**: Analytics integration (`src/components/Posthog.astro`)
- **Meta Pixel**: Facebook/Meta tracking (`src/components/MetaPixelCode.astro`)

### Styling

- **TailwindCSS v4**: Via `@tailwindcss/vite` plugin
- **DaisyUI**: Component library with theme support
- **Theme System**: Light/dark mode via `data-theme` attribute
- **Custom Fonts**: IBM Plex Mono, Space Grotesk, Space Mono

## Zero-Landings

### Concept

Zero-landings are interactive landing pages designed to validate product ideas and collect early leads before full development. Each landing page:

- Has its own unique theme and design
- May include interactive elements (quizzes, calculators, demos, etc.)
- Focuses on communicating a specific product concept
- Collects leads via the shared `actions.createLead` Astro Action

### Structure

Zero-landings are located in `src/pages/magiclink/`:

```
src/pages/magiclink/[landing-name]/
├── index.astro                 # Landing page
├── components/                 # Landing-specific components (optional)
│   └── InteractiveWidget.svelte
└── styles.css                  # Landing-specific styles (optional)
```

### Creating a New Zero-Landing

1. **Create landing directory**: `src/pages/magiclink/[landing-name]/index.astro`

2. **Use Layout or create custom**:

   - Use `Layout.astro` for consistency with main site
   - Or create a custom layout for unique branding

3. **Add interactive components** (optional):

   - Create Svelte components in `src/components/` or landing-specific folder
   - Use for quizzes, calculators, interactive demos, etc.

4. **Implement lead collection** by calling the `createLead` Astro Action:

   ```typescript
   import { actions } from "astro:actions";

   const { error } = await actions.createLead({
     email,
     experiment: "landing-name",
     meta: {
       /* additional structured data */
     },
   });

   if (error) {
     // surface a user-friendly error
   }
   ```

5. **Track analytics**: Ensure Posthog and Meta Pixel are included (via Layout)

### Best Practices

- **Unique experiment identifier**: Use descriptive `experiment` field value (e.g., "magiclink", "product-x-v1")
- **Minimal dependencies**: Keep landings lightweight and fast-loading
- **Mobile-first**: Ensure responsive design
- **Clear value proposition**: Focus on communicating the core idea quickly
- **Simple lead capture**: Minimize form fields to reduce friction
- **A/B testing ready**: Use `experiment` field to track different variants

## Routes Structure

- **`src/pages/`**: Main marketing pages
  - `/`: Homepage
  - `/contact`: Contact page
  - `/custom-solution`: Custom solution page (Primary offering)
  - `/magiclink/*`: Zero-landings
  - `/privacy-policy`, `/terms-and-conditions`: Legal pages
- **`src/actions/`**: Astro Actions (server functions)
  - `createLead`: Lead capture (validates with Zod, writes to SQLite)

## Shared Components

Located in `src/components/`:

- **`Header.astro`**: Site navigation
- **`Footer.astro`**: Site footer
- **`Hero.astro`**: Hero section component
- **`ContactForm.svelte`**: Lead capture form (calls `actions.createLead`)
- **`WaitlistForm.svelte`**: Waitlist email capture (calls `actions.createLead`)
- **`Portfolio.astro`**: Portfolio showcase
- **`TechStack.astro`**: Technology stack display
- **`Offer.astro`**: Offer/pricing component
- **`Background.astro`**: Background graphics
- **`ThemeController.svelte`**: Theme switching component
- **`Posthog.astro`**: Analytics integration
- **`MetaPixelCode.astro`**: Meta Pixel tracking

## Important Notes

### Environment Setup

Copy `.env.example` to `.env` and fill in required values. Relevant variables:

- `SQLITE_DB_PATH`: Absolute path to the SQLite file (default: `./data/cogisoft.db`, `/data/cogisoft.db` in Docker)
- `PUBLIC_POSTHOG_URL`, `PUBLIC_POSTHOG_TOKEN`: Posthog analytics
- `HOST`, `PORT`: Standard `@astrojs/node` standalone server overrides (defaults: `0.0.0.0`, `4321`)

### Astro Configuration

- `output: "server"` with `@astrojs/node` standalone adapter
- `better-sqlite3` is marked as an SSR external in `vite.ssr.external`
- Build output: `dist/` (`dist/server/entry.mjs` is the runtime entrypoint)
- Svelte integration enabled for interactive components

### Database Setup

- The SQLite file is created on first request (`getDb()` is lazy)
- In Docker, the parent directory is mounted as a volume so data persists across rebuilds
- Schema migrations are idempotent and run on every connection bootstrap

### Styling Guidelines

- Use TailwindCSS utility classes
- Leverage DaisyUI components for consistency
- Custom styles in `src/styles/global.css`
- Theme variables via DaisyUI theme system
- Responsive design: mobile-first approach

### Lead Collection Pattern

All client-side lead capture should call the `createLead` Astro Action:

```typescript
import { actions } from "astro:actions";

const { data, error } = await actions.createLead({
  email,
  name,        // optional
  message,     // optional
  experiment,  // landing identifier
  meta: {
    // Additional structured data
  },
});

if (error) {
  throw new Error(error.message);
}
```

This ensures consistent, type-safe lead tracking with end-to-end Zod validation and allows for analysis of which landings perform best. Server-side reads can use `listLeads()` from `src/lib/db/leads.ts`.
