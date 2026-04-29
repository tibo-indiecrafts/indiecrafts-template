# Indiecrafts Template — CLAUDE.md

> Config-first, modular Next.js template for client websites. Fork the repo, edit `src/config/*` + drop blocks into `src/components/sections-*`, ship.

Read this top to bottom before touching code.

## The layer spine

Every page renders top-down through this chain. Each layer takes typed inputs and ships defaults (`config.ts` + `en.json` where applicable).

```
ui/                       primitives (shadcn, READ-ONLY)
  ↳ ui-effects/           aesthetic primitives — flat upstream files (Aceternity, READ-ONLY)
                          + branded wrapper FOLDERS (editable, e.g. CommandPalette/)
       ↳ sections-{type}/<variant>/   content blocks: schema + config + en.json + .stories
            ↳ pages-{bucket}/<variant>/   compositions: config (incl. SEO) + en.json + .stories
                 ↳ wrapped by layouts/<Name>Layout/   chrome (header / main / footer slots)
                      ↳ rendered by src/app/[locale]/<seg>/page.tsx   ROUTE FILE
```

**The mental model**:
- `src/components/` is THE library — edit it directly when customizing for a project, delete what you don't use.
- `src/app/[locale]/` is the boundary — Next.js routes import templates straight from `@/components/pages-{bucket}/<variant>`.
- No fork, no overlay, no indirection — one tree, edit in place.

**Two ways to customize**:
1. **Translations only** — edit root `messages/<locale>.json` to override `blocks.<key>.*`. No code changes.
2. **Edit in place** — open the section/template/layout under `src/components/`, change what you need. Delete components/templates you'll never use.

## Quick Reference

```bash
pnpm dev                # Dev server (port 3000, Turbopack). Runs gen:styles first.
pnpm build              # Production build. Runs gen:styles first.
pnpm tsc                # Type check (strict, no emit)
pnpm lint               # ESLint (~25 jsx-a11y rules enumerated)
pnpm format             # Prettier write
pnpm test               # Vitest (happy-dom, 80% coverage target)
pnpm gen:styles         # Regenerate src/app/_component-styles.css
pnpm new:page <id>      # Scaffold a page folder + route + messages
pnpm verify:contrast    # WCAG AA check on theme tokens
pnpm verify:pages       # Cross-validate the pages registry
pnpm verify:styles      # Drift-guard on the CSS aggregator
pnpm verify:quick       # tsc + lint
pnpm verify             # tsc + lint + format:check + contrast + pages + styles
pnpm storybook          # Storybook dev server
pnpm build-storybook    # Static Storybook build (runs gen:styles first)
```

## Tech Stack

- **Next.js 16** App Router, Turbopack, React 19, React Compiler enabled, `proxy.ts` (was middleware)
- **TypeScript strict** — no escape hatches without a written reason
- **Tailwind CSS v4** — CSS-first via `@theme inline` in `globals.css`; `@custom-variant dark` for `data-theme` toggling
- **next-intl v4** — locale-scoped routes, localized URL segments, hreflang
- **next-themes** — system / light / dark, FOUC-free
- **Zod** validates `siteConfig` + `themeConfig` at boot
- **Storybook 10** for visual review (titles mirror folder structure — see Storybook section)
- **shadcn/ui (new-york, zinc)** + Aceternity + Magic UI catalogs

## Project Structure

```
src/
├── app/                      # Next App Router (locale-scoped)
│   ├── layout.tsx            # passthrough root
│   ├── [locale]/layout.tsx   # html, fonts, providers, JSON-LD
│   ├── globals.css           # tokens + @import "_component-styles.css"
│   └── _component-styles.css # AUTO-GENERATED — do not edit
├── config/                   # SINGLE SOURCE OF TRUTH (edit here first)
│   ├── site.config.ts · locales.config.ts · theme.config.ts
│   ├── seo.config.ts · features.config.ts · llms.config.ts
│   ├── routes.types.ts · routes.config.ts · navigation.config.ts
│   └── pages/                # one folder per page
│       └── <id>/{page.config.ts, messages/{en,fr}.json}
├── components/
│   ├── ui/                          # staging dir — `shadcn add` drops here for review
│   ├── ui-primitives/               # vetted shadcn primitives (read-only, CLI-managed)
│   ├── ui-effects/                  # Aceternity / Magic UI flat files (read-only)
│   │   └── <Name>/                  #   branded wrapper folders (yours to edit)
│   ├── layouts/                     # page templates + their owned chrome
│   │   ├── _shared/                 # cross-layout chrome: SkipLink, LocaleSwitcher,
│   │   │                            #   Logo, ThemeProvider, ThemeToggle
│   │   ├── DefaultLayout/           # DefaultLayout.tsx + SiteHeader/, SiteFooter/
│   │   ├── DashboardLayout/         # DashboardLayout.tsx + DashboardHeader/
│   │   │   ├── sidebars/            #   AppSidebar, SidebarLeft, SidebarRight
│   │   │   ├── widgets/             #   Calendars, DatePicker, TeamSwitcher, …
│   │   │   └── nav/                 #   NavMain, NavUser, NavWorkspaces, …
│   │   ├── FullBleedLayout/, ProseLayout/, SidebarLayout/
│   │   └── registry.ts
│   ├── sections-marketing-{cta,contact,content,faq,features,footer,pricing,stats,team,testimonials}/
│   ├── sections-app-{dashboard,charts,data,settings}/
│   ├── sections-auth/               # Login, SignUp, ForgotPassword, LoginForm, SignupForm
│   └── pages-{marketing,app,auth,error}/   # full-page templates: layout + sections, with config.ts + en.json
├── i18n/
│   ├── routing.ts · request.ts
│   └── block-messages.ts     # aggregates en.json from every component bucket
├── lib/                      # metadata, logger, typography, seo/jsonld, zod-error-map
├── types/messages.ts         # MessageKey union (auto-derived from message tree)
└── proxy.ts                  # Next 16 locale routing
```

### Component-folder convention

| Bucket                                       | Atomic level | Edit? | Storybook group                       |
|----------------------------------------------|--------------|-------|----------------------------------------|
| `ui/`                                        | atoms        | NO    | UI Primitives                          |
| `ui-effects/<flat>.tsx`                      | atoms        | NO    | UI Effects                             |
| `ui-effects/<Name>/`                         | molecules    | YES   | UI Effects/{Name}                      |
| `layouts/_shared/<X>/`                       | molecules    | YES   | Layouts/Shared/{X}                     |
| `layouts/<Name>Layout/`                      | templates    | YES   | Layouts/{Name}                         |
| `layouts/<Name>Layout/<Chrome>/`             | organisms    | YES   | Layouts/{Name}/{Chrome}                |
| `layouts/<Name>Layout/<Group>/<Chrome>/`     | organisms    | YES   | Layouts/{Name}/{Group}/{Chrome}        |
| `sections-marketing-{type}/<variant>/`       | organisms    | YES   | Sections/Marketing/{Type}/{Variant}    |
| `sections-app-{type}/<variant>/`             | organisms    | YES   | Sections/App/{Type}/{Variant}          |
| `sections-auth/<variant>/`                   | organisms    | YES   | Sections/Auth/{Variant}                |
| `pages-{category}/<variant>/`                | templates    | YES   | Pages/{Category}/{Variant}             |

**Chrome lives where it's used.** Cross-layout chrome (used by every layout — `SkipLink`, `LocaleSwitcher`, `Logo`, `ThemeToggle`, `ThemeProvider`) lives in `layouts/_shared/`. Layout-specific chrome (`SiteHeader` only used by `DefaultLayout`; `AppSidebar` + `DashboardHeader` + `nav/*` + `sidebars/*` + `widgets/*` only used by `DashboardLayout`) lives **inside** the owning layout's folder. Group sibling chrome by role under sub-folders (`DashboardLayout/sidebars/`, `DashboardLayout/widgets/`, `DashboardLayout/nav/`) when a layout has more than ~4 chrome pieces.

This rule keeps `sections-*/` strictly for content blocks the page-renderer iterates from `page.config.sections[]`. Anything composed by a layout (and never put in a page config) is chrome, not a section.

**Folder discipline:** every component, section, and layout lives in its own folder with `<Name>.tsx` + `index.ts` barrel + optional `schema.ts`. Page-folders also co-locate `messages/{en,fr}.json`.

## Storybook sidebar — derived from folder paths

Story `title` follows the folder layout deterministically. `_shared` collapses to `Shared`; the `Layout` suffix on named layouts is stripped (`DefaultLayout` → `Default`).

| File path                                                              | Title                            |
|------------------------------------------------------------------------|-----------------------------------|
| `ui-primitives/button.stories.tsx`                                     | `UI Primitives/Button`           |
| `ui-effects/meteors.stories.tsx`                                       | `UI Effects/Meteors`             |
| `ui-effects/CommandPalette/CommandPalette.stories.tsx`                 | `UI Effects/CommandPalette`      |
| `layouts/_shared/SkipLink/SkipLink.stories.tsx`                        | `Layouts/Shared/SkipLink`        |
| `layouts/DefaultLayout/DefaultLayout.stories.tsx`                      | `Layouts/Default`                |
| `layouts/DefaultLayout/SiteHeader/SiteHeader.stories.tsx`              | `Layouts/Default/SiteHeader`     |
| `layouts/DashboardLayout/sidebars/AppSidebar/AppSidebar.stories.tsx`   | `Layouts/Dashboard/Sidebars/AppSidebar` |
| `layouts/DashboardLayout/widgets/Calendars/Calendars.stories.tsx`      | `Layouts/Dashboard/Widgets/Calendars` |
| `layouts/DashboardLayout/nav/NavMain/NavMain.stories.tsx`              | `Layouts/Dashboard/Nav/NavMain`  |
| `sections-marketing-cta/cta-1/CallToAction.stories.tsx`                | `Sections/Marketing/Cta/Cta1`    |
| `sections-app-charts/ChartAreaAxes/X.stories.tsx`                      | `Sections/App/Charts/AreaAxes`   |
| `sections-auth/Login/Login.stories.tsx`                                | `Sections/Auth/Login`            |
| `pages-marketing/landing-1/Landing1.stories.tsx`                       | `Pages/Marketing/Landing1`       |
| `pages-marketing/about-1/About1.stories.tsx`                           | `Pages/Marketing/About1`         |
| `pages-app/dashboard-1/Dashboard1.stories.tsx`                         | `Pages/App/Dashboard1`           |
| `pages-auth/login-1/Login1.stories.tsx`                                | `Pages/Auth/Login1`              |
| `pages-auth/signup-1/Signup1.stories.tsx`                              | `Pages/Auth/Signup1`             |
| `pages-auth/forgot-password-1/ForgotPassword1.stories.tsx`             | `Pages/Auth/ForgotPassword1`     |
| `pages-error/error-1/Error1.stories.tsx`                               | `Pages/Error/Error1`             |
| `pages-error/not-found-1/NotFound1.stories.tsx`                        | `Pages/Error/NotFound1`          |

If you add a story file by hand, set its `title` to match this convention so the sidebar stays clean.

## Component-co-located CSS (auto-aggregated)

Animations and any other component-scoped styles live next to the component in a sibling `<name>.css` file:

```css
/* src/components/ui-effects/meteors.css */
@theme inline {
  --animate-meteor-effect: meteor-effect 5s linear infinite;
  @keyframes meteor-effect {
    0% { transform: rotate(215deg) translateX(0); opacity: 1; }
    70% { opacity: 1; }
    100% { transform: rotate(215deg) translateX(-500px); opacity: 0; }
  }
}
```

`scripts/generate-component-styles.mjs` walks `src/components/**/*.css` and writes the sorted `@import` list to `src/app/_component-styles.css` (tracked, deterministic). `globals.css` only imports the aggregator. The codegen runs as `predev` / `prebuild` / `prebuild-storybook`, so dropping a new `.css` next to a component is enough — no edits to `globals.css`.

`pnpm verify:styles` regenerates and fails CI if the committed file is stale.

## The Config-First Principle

The default template ships rich defaults. When customizing for a real project, edit `src/config/*` + `messages/*` first; touch component code only when defaults can't express the change.

- Component code NEVER hard-codes brand strings, URLs, colors, nav links, or SEO copy — read them from `@/config/*`.
- Adding content is a config edit, never a component rewrite.
- New content surface area = new section variant, never inline JSX scattered across pages.
- Copying a component file to change two strings? Stop — push the strings into config or `messages/`.
- Don't need a section/template? Delete the folder. The codegen regenerates without it.

## Sections — the content model

Sections are content blocks that page-templates compose. They live in per-domain buckets:

- Marketing → `src/components/sections-marketing-{type}/<variant>/` (cta, faq, features, pricing, …)
- App → `src/components/sections-app-{type}/<variant>/` (charts, dashboard, data, settings). Dashboard chrome (sidebars, widgets, header, nav lists) lives **inside** `layouts/DashboardLayout/`, not under `sections-app-*` — see Chrome rule above.
- Auth → `src/components/sections-auth/<variant>/` (Login, SignUp, …)

**Section folder layout** (5-file pattern):
```
sections-marketing-cta/cta-1/
├── CallToAction.tsx           # component
├── schema.ts                  # typed Block shape
├── config.ts                  # sample data (cta1Sample export)
├── en.json                    # source-of-truth English strings
├── *.stories.tsx              # Storybook
└── index.ts                   # barrel
```

**Adding a section variant** (the happy path):
1. Drop a new folder under the right bucket: `sections-marketing-cta/cta-2/`.
2. Add the 5-file pattern. Pick a unique block key like `"cta-2"` for `<name>Key`.
3. Run `pnpm gen:i18n` — the codegen picks up the new `en.json` automatically and updates `block-messages.ts` + `types/messages.ts`.
4. Reference the section directly inside whichever page-template needs it (`<Cta2Section {...cta2Sample} id="..." />`).
5. `pnpm verify` — done.

**Section variants in one component** — when 2–4 looks share the same content shape, add a `variant?: "default" | "compact"` discriminator to the schema instead of a new section type. Rule of thumb: more than 2 optional fields only relevant for one variant → split into a separate section.

## Layouts — per-page chrome

Each page-template picks a layout via its `<name>Defaults.layout` (overridable per-callsite via the `layout` prop). The registry in `src/components/layouts/registry.ts` exposes:
- `default` — no wrapper; sections control their own containers
- `full-bleed` — edge-to-edge
- `prose` — narrow reading column
- `sidebar` — two-column with sticky aside
- `dashboard` — admin shell

**Adding a layout:** drop `<Name>Layout/<Name>Layout.tsx` in `src/components/layouts/`, register in `registry.ts`, extend `LayoutName`.

### Chrome ownership — layouts, not the locale layout

`[locale]/layout.tsx` only mounts providers (`ThemeProvider`, `NextIntlClientProvider`) and the JSON-LD graph. The chrome — `SkipLink`, header, `<main id="main" tabIndex={-1}>`, footer — lives **inside** each layout. That makes Storybook show pages with their real chrome AND lets each layout pick the right defaults.

**Configurable slots.** Every layout accepts `header?: boolean | ReactNode` and `footer?: boolean | ReactNode`:
- `true` → render the layout's default (e.g. `<SiteHeader />` for `DefaultLayout`, `<DashboardHeader />` for `DashboardLayout`, `<SiteFooter />` for the footer slot everywhere).
- `false` → render nothing.
- `ReactNode` → render that node in place of the default.

**Default chrome per layout** (every layout ships a footer; pass `footer={false}` to opt out):

| Layout            | Default header           | Default footer  |
|-------------------|--------------------------|-----------------|
| `DefaultLayout`   | `<SiteHeader />`         | `<SiteFooter />`|
| `ProseLayout`     | `<SiteHeader />`         | `<SiteFooter />`|
| `SidebarLayout`   | `<SiteHeader />`         | `<SiteFooter />`|
| `FullBleedLayout` | none (opt-in)            | `<SiteFooter />`|
| `DashboardLayout` | `<DashboardHeader />` (fixed; `header` prop ignored) | `<SiteFooter />` (inside the inset, below `<main>`) |

**The single-`<main>` rule still holds.** Each layout MUST render exactly one `<main id="main" tabIndex={-1}>`. If you need shadcn's `<SidebarInset>` (which is itself a `<main>`), inline its classes onto a `<div>` like `DashboardLayout` does, and put `<main>` on the inner content wrapper.

**Bare routes** (auth, error, not-found) must wrap themselves in a layout — typically `FullBleedLayout` for auth and `DefaultLayout` for error/404 — so they get the SkipLink target. Don't render forms or sections directly under the locale layout.

## Page templates — `pages-*/`

`src/components/pages-{category}/<variant>/` ships ready-made compositions of one layout + N section samples. Each template is a real React component used by both Storybook (`Pages/{Category}/{Variant}`) and live routes — `[locale]/page.tsx` imports `Landing1`, `[locale]/dashboard/page.tsx` imports `Dashboard1`, etc. Categories mirror the section buckets: `pages-marketing/`, `pages-app/`, `pages-auth/`, `pages-error/`. Current starter set:

| Folder                                           | Default layout    | Used by route |
|--------------------------------------------------|-------------------|----------------|
| `pages-marketing/landing-1/Landing1.tsx`         | `default`         | `/`            |
| `pages-marketing/about-1/About1.tsx`             | `default`         | `/about`       |
| `pages-app/dashboard-1/Dashboard1.tsx`           | `dashboard`       | `/dashboard`   |
| `pages-auth/login-1/Login1.tsx`                  | `full-bleed`      | `/login`       |
| `pages-auth/signup-1/Signup1.tsx`                | `full-bleed`      | `/signup`      |
| `pages-auth/forgot-password-1/ForgotPassword1.tsx` | `full-bleed`    | `/forgot-password` |
| `pages-error/error-1/Error1.tsx`                 | `default`         | `error.tsx`    |
| `pages-error/not-found-1/NotFound1.tsx`          | `default`         | `not-found.tsx`|

**Folder shape — same 5-file pattern as sections:**
```
pages-marketing/landing-1/
├── Landing1.tsx           # component (layout + sections)
├── Landing1.stories.tsx   # default + layout-variant stories
├── config.ts              # `<name>Defaults` (layout, section ids, …) + namespace
├── en.json                # page-scoped translations under `blocks.<key>.*`
└── index.ts               # barrel
```

**Configurable props (every template).** All page-templates accept these so the same component renders differently in Storybook stories and live routes:
- `layout?: LayoutName` — override the wrapping layout (default in `config.ts`).
- `header?: boolean | ReactNode` — forwarded to the layout's header slot.
- `footer?: boolean | ReactNode` — forwarded to the layout's footer slot.

**SEO defaults are part of the template.** Each template's `config.ts` exports a `<name>Defaults.seo` of type `PageSeo` (titleKey, descriptionKey, keywords, openGraph, …). Routes pass that object as `templateSeo`, and `buildMetadata` merges it with any `seo:` declared on the route's `page.config.ts` (route wins per field):

```tsx
// src/app/[locale]/page.tsx — route just wires defaults + page config.
import homePage from "./page.config";
import { Landing1, landing1Defaults } from "@/components/pages-marketing/landing-1";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    page: homePage,
    templateSeo: landing1Defaults.seo,
    locale,
  });
}
```

**To expand SEO per page**, declare overrides on the route's `page.config.ts`:

```ts
// src/app/[locale]/page.config.ts
export default definePage({
  key: "/", id: "home", slugs: "/", layout: "default",
  seo: {
    keywords: ["holiday", "campaign"],
    noindex: true,
    structuredData: [/* page-specific JSON-LD */],
  },
});
```

Any field set here overrides the template default. Fields you omit fall back to the template. Adding SEO to a new page = one field in `page.config.ts`, no spread plumbing in the route.

**Adding a template:**
1. `mkdir src/components/pages-<category>/<variant>/`
2. Drop the 5 files. Choose `<name>Key = "<variant>"`. Make `<name>Defaults.seo` point its `titleKey`/`descriptionKey` at `"blocks.<variant>.title"` / `"blocks.<variant>.description"` and add those keys to `en.json`.
3. Pull section copy from each section's `<type>Sample` export — never inline strings.
4. Run `pnpm gen:i18n` — codegen picks up the new `en.json` automatically and updates `block-messages.ts` + `types/messages.ts`.
5. Reference from a route: `import { <Name>, <name>Defaults } from "@/components/pages-<category>/<variant>"`.

**Customizing a template** — open `src/components/pages-{bucket}/<variant>/` and edit. `.tsx`, `config.ts`, `en.json` are all source-of-truth. No fork, no overlay, no swap-export ritual: change what you need where it lives. Delete templates you'll never use — codegen rebuilds without them.

## Routing

- ALL routes live under `src/app/[locale]/` — including admin routes like `/dashboard` (renders as `/en/dashboard`, `/fr/dashboard`). Keeping the dashboard inside the locale tree means it inherits the locale layout's `ThemeProvider` and `NextIntlClientProvider` instead of duplicating providers (the chrome itself comes from the in-page layout each route picks).
- Internal pathnames declared once in `src/config/routes.config.ts` with per-locale translations.
- ALWAYS import `Link`, `useRouter`, `redirect`, `usePathname`, `getPathname` from `@/i18n/routing` — never from `next/link` or `next-intl/navigation`.
- `StaticAppPathname` excludes dynamic segments — use it in nav config + section schemas. `AppPathname` for sitemap/metadata.

## i18n workflow

Three tiers merge at request time into a single `next-intl` tree:

1. **Global** → `messages/<locale>.json` at repo root. Cross-cutting strings: `nav`, `cta`, `footer`, `common`, `typography`, `llms`.
2. **Per-route** → `src/app/[locale]/<seg>/messages/<locale>.json`. Merged under `pages.<id>.*`. Useful when a route needs custom strings the template doesn't provide.
3. **Per-block / per-template** → `src/components/<bucket>/<variant>/en.json`. Aggregated by `src/i18n/block-messages.ts` under `blocks.<key>.*` (English only — non-English locales override at root tier 1).

**Adding a locale:** push into `SUPPORTED_LOCALES`, mirror `messages/<locale>.json` at root + every per-page folder, add the static imports to `src/config/pages/messages.ts`.

**Rules:**
- Never inline user-facing strings — pass `…Key` props that resolve via `useTranslations()`.
- Keep key trees identical across every locale JSON.
- ALWAYS `setRequestLocale(locale)` at the top of server components that use translations or metadata.

### Customizing translations (the three patterns)

```jsonc
// 1. Override one block string for one locale — ROOT messages.
// messages/fr.json
{
  "blocks": {
    "cta-1": {
      "title": "Mon CTA personnalisé"
    }
  }
}

// 2. Page-specific override — PER-ROUTE messages, then aim a section/template
//    prop at the new key. messages/<locale>.json under pages.<id>.*:
// src/app/[locale]/messages/en.json
{
  "home": {
    "heroTitle": "Welcome"
  }
}
// Then in the template (edit src/components/pages-marketing/landing-1/Landing1.tsx):
// <Features1Section ... titleKey="pages.home.heroTitle" />

// 3. Add a brand-new translation key — bundle it with the template's
//    en.json under blocks.<key>.*. `pnpm gen:i18n` picks it up.
```

### MessageKey type

`src/types/messages.ts` derives a dotted-path union from the merged English message tree. `titleKey`, `descriptionKey`, etc. on every section schema is typed as `MessageKey` — typos are compile errors. No codegen step.

## Feature flags — three tiers

`src/config/features.config.ts`:
- **Global** — `analytics`, `cookieBanner`, `llmsTxt`, `localeSwitcher`, `newsletter`
- **Modules** (`features.modules.*`) — `blog`, `shop`, `search`, `comments`. Pages attach via `moduleKey: "blog"`; off → 404
- **Per-page / per-section** (`enabled?: boolean`) — hide a single page/section without touching modules

Route files gate with `isPageVisible(page)` then `notFound()`. Sitemap filters via the same helper.

## SEO + JSON-LD

- `buildMetadata({ blueprint, locale, params? })` is the only way to set `<head>` tags. Builds canonical + full hreflang map.
- `siteConfig.url` must be the production origin in every environment (`NEXT_PUBLIC_SITE_URL`).
- `sitemap.ts` lists static routes × locales — append for dynamic sources (blog slugs etc).
- JSON-LD lives in `src/lib/seo/jsonld.tsx` — `buildOrganizationSchema()`, `buildWebSiteSchema()`, `composeGraph()`. Root layout emits Organization + WebSite via one graph; per-page schemas go in `page.seo.structuredData[]` and route files emit them inline alongside `generateMetadata`.
- **Satori gotcha:** `next/og` doesn't understand `oklch()` — that's why `themeConfig.hexColors` exists alongside `themeConfig.colors`. Update both in the same commit when rebranding.

## Theming

- Tailwind v4 + CSS variables. Tokens live in `theme.config.ts`, mirrored in `globals.css :root` as `oklch(...)`.
- Two dark triggers (precedence): `html[data-theme="dark"]` (user choice via next-themes), then `@media (prefers-color-scheme: dark)`.
- `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))` makes `dark:` utilities match on the attribute.
- ThemeToggle (in `theme/`) cycles system → light → dark via `useSyncExternalStore` (SSR-safe).
- Container: `max-w-(--max-container)` + `px-(--gutter)`.
- `pnpm verify:contrast` parses globals.css, asserts WCAG AA across theme-token pairs. Run after any theme change.

## Accessibility (WCAG 2.1 AA target)

- `<html lang>` + `dir` come from the active locale.
- `components/layout/SkipLink` is mounted first in the body, targets `#main`.
- `<main id="main" tabIndex={-1}>` in `[locale]/layout.tsx`.
- Every section: `<section aria-labelledby="…">` pointing at its heading.
- Prefer semantic HTML over ARIA. `<button type="button">`, `<a>`, `<input>` — ARIA roles only when no native element fits.
- Icons `aria-hidden="true"` by default; `aria-label` only when the icon is the sole label.
- Never `onClick` on `<div>`/`<span>` — use a button.
- Respect `prefers-reduced-motion` (handled in `globals.css`).

## Critical rules

- NEVER commit `.env*` (only `.env.example`).
- NEVER hard-code brand strings, URLs, colors, or nav entries in components — read from `@/config/*`.
- NEVER import from `next/link` or `next-intl/navigation` — use `@/i18n/routing`.
- NEVER add `as any` — fix the type. If genuinely impossible, eslint-disable with a one-line reason.
- NEVER swallow errors — at minimum `logger.error(...)` from `@/lib/logger`.
- NEVER flatten a component into a bare file — folder + `index.ts` barrel.
- NEVER put page-specific strings in `messages/<locale>.json` (root) — they belong under `src/config/pages/<id>/messages/`.
- NEVER edit `src/components/ui-primitives/**` (vetted shadcn primitives, CLI-managed) or the FLAT files at `src/components/ui-effects/*.tsx` (upstream Aceternity / MagicUI). Wrapper folders inside `ui-effects/` (e.g. `ui-effects/CommandPalette/`) are yours to author. New shadcn drops land in `src/components/ui/` for review before being promoted into `ui-primitives/`.
- NEVER set state inside `useEffect` to mark hydration — use `useSyncExternalStore`.
- ALWAYS `setRequestLocale` at the top of server components using translations or metadata.
- ALWAYS run `pnpm verify` before pushing. Pre-push hook runs lint + tsc; full verify also covers format + contrast + pages + styles.

## File-size discipline

- Components < 200 lines. Split at the natural seam.
- Page blueprints < 150 lines. New section type instead of inlining variation.
- Config files exempt — as long as the data requires.

## Security baseline

- No `dangerouslySetInnerHTML` from user input. Static JSON-LD is the only allowed use.
- No secrets in `NEXT_PUBLIC_*`.
- Validate external data at boundaries (server actions, API routes) with Zod.
- Security headers + CSP set globally in `next.config.ts` (uses `getCSPConnectSources()` from `environments.config.ts`).
- Restrict remote image hosts in `next.config.ts#images.remotePatterns`.

## Adding a new page (the happy path)

1. Pick or create a page-template under `src/components/pages-{bucket}/<variant>/` (5-file pattern, ships SEO defaults).
2. Create the route folder and a slim `page.config.ts` (`key`, `id`, `slugs`, `layout`).
3. Run `pnpm gen` — codegen picks up the new `page.config.ts` AND any new `en.json`, regenerating routes + i18n registries.
4. Add the route file:
   ```tsx
   import newPage from "./page.config";
   import { Template, templateDefaults } from "@/components/pages-<bucket>/<variant>";
   import { buildMetadata } from "@/lib/metadata";
   export async function generateMetadata({ params }: Props) {
     const { locale } = await params;
     return buildMetadata({ page: { ...newPage, seo: templateDefaults.seo }, locale });
   }
   export default async function Page({ params }: Props) {
     const { locale } = await params;
     setRequestLocale(locale);
     return <Template />;
   }
   ```
5. Optional: nav entry in `navigation.config.ts`, `opengraph-image.tsx` in the segment.
6. `pnpm verify` — done.

## shadcn/ui — the upstream rule

- `src/components/ui-primitives/**` is the vetted shadcn surface — READ-ONLY. New `pnpm dlx shadcn@latest add <component>` drops land in `src/components/ui/` (staging) where lint runs against them; promote into `ui-primitives/` once they pass review.
- Need a variant? Drop a wrapper folder inside `src/components/ui-effects/<Name>/` (the same directory holds upstream flat files; folder children are editable).
- `@/lib/utils` holds the canonical `cn()` (clsx + tailwind-merge) — don't rename, shadcn writes against it.
- `.mcp.json` wires `shadcn` (`npx shadcn@latest mcp`) and `magicui` (`npx -y @magicuidesign/mcp@latest`) MCP servers. Run `/mcp` to verify.

## Aceternity / Magic UI — same upstream rule

The FLAT files at `src/components/ui-effects/*.tsx` are hand-copied upstream code. Read-only by the same logic — patches risk being clobbered by future updates. Variants go in **wrapper folders** that live in the same directory (`src/components/ui-effects/<Name>/`); the folder shape mirrors a section's 5-file pattern and is yours to edit. ESLint ignores `ui-effects/*.tsx` (the upstream files only) — wrapper folders stay linted.

Both `ui/` and the flat `ui-effects/*.tsx` are excluded from `tsc` via `tsconfig.json` (the upstream code has known type issues we don't own).

## Logging

`logger.debug/info/warn/error` from `@/lib/logger` — never raw `console.*` in committed code (CI lint catches it).

## ESLint — jsx-a11y enumerated

`eslint.config.mjs` enumerates ~25 `jsx-a11y` rules as `error`. Catches `<img>` without `alt`, `onClick` on `<div>`, missing `<html lang>`, redundant ARIA roles, positive `tabIndex`, and so on.

## Git hooks

Husky pre-commit runs `pnpm lint-staged` (eslint + prettier on staged files). Pre-push runs `pnpm lint && pnpm tsc`. Bypass only in emergency (`--no-verify`).

## Known gotchas

- **Tailwind v4 CSS vars** — use `max-w-(--foo)` (the v4 arbitrary-value syntax). Don't revert to `max-w-[var(--foo)]`.
- **next-intl typed `t()`** — `AppConfig.Messages` is intentionally loose so config-driven `t(key)` compiles. Missing keys appear as runtime warnings.
- **Dynamic pathnames** — pass through the object form `{ pathname: "/blog/[slug]", params: { slug } }`.
- **LocaleSwitcher + dynamic routes** — swaps the locale segment in the URL directly so it works on `/blog/[slug]`.
- **Next 16 `proxy.ts`** — same API as the old `middleware.ts`, new name only.

## Verification — what CI runs

1. `pnpm tsc` — strict, no emit
2. `pnpm lint` — zero warnings
3. `pnpm format:check`
4. `pnpm verify:contrast`
5. `pnpm verify:pages`
6. `pnpm verify:styles` — drift-guard on `_component-styles.css`
7. `pnpm build` — prerenders every static route × locale

Treat warnings as errors. A clean tree is a shippable tree.
