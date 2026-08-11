# indiecrafts.dev — platform

Config-first Next.js 16 template, structured as a **full-platform monorepo** with the
dev framework in-repo. **Two root folders:**

- **`code/`** — the pnpm + Turborepo workspace (the product). `apps/web` is the Next.js
  app (`@indiecrafts/web`); `packages/ modules/ db/ infra/` are slots for growth; and
  `code/docs/` is the product documentation site.
- **`method/`** — the `claude-tasks` dev framework (planning): `process/` (7-phase
  sprint), `engineering/` (the brain), `templates/`, `work/` (the lab) — browsable as
  its own docs site.

**Stack:** Next.js 16 · React 19 · TypeScript strict · Tailwind v4 · next-intl v4 ·
next-themes · shadcn/ui · Sanity. Workspace: pnpm + Turborepo.

Detailed conventions → [`CLAUDE.md`](./CLAUDE.md) · design tokens → [`DESIGN.md`](./DESIGN.md) · framework → [`method/`](./method/).

## Getting started

Run everything from the **repo root** — scripts delegate to the app (`@indiecrafts/web`) via Turborepo. The app lives at `code/apps/web`.

```bash
pnpm install            # installs the whole workspace (all of code/)
pnpm dev                # http://localhost:3000  (turbo → @indiecrafts/web)
pnpm build              # production build → code/apps/web/.next
pnpm verify             # tsc + lint + format:check + contrast + react-doctor (CI gate)
pnpm verify:quick       # tsc + lint (manual pre-PR check)
```

## Deploy — not locked to one host

The workspace installs at the **repo root**; the app builds to `code/apps/web/.next`.

- **Netlify** — `netlify.toml` at root (`command = pnpm build`, `publish = code/apps/web/.next`); base stays root so pnpm installs the workspace.
- **Vercel / Cloudflare / anywhere** — point the project at this repo, keep **install at the repo root**, set build `pnpm build` and Root Directory / output to `code/apps/web`. Each `apps/*` you add later is its own deploy target.

## Blog (Sanity-powered, optional)

A full Sanity-backed editorial blog is wired into the template — feature-flagged so you can ship without it.

- **Turn it on** — set `features.blog: true` in `code/apps/web/src/config/index.ts`, drop `NEXT_PUBLIC_SANITY_PROJECT_ID` + dataset into `.env.local`, run `pnpm dev`. Editor lives at <http://localhost:3000/studio>.
- **What you get** — `/blog`, `/blog/[slug]`, `/blog/category/[slug]`, `/blog/tag/[slug]`, `/author/[slug]`, RSS + Atom feeds (per locale), Markdown export, draft preview, live content subscriptions, locale-filtered (EN + FR by default), embedded Sanity Studio at `/studio`.
- **Page-builder** — 13 modules (9 inline-embeddable inside post bodies, 4 layout-slot only). Editors compose post chrome from the `blog` singleton's `postModules` array; the body editor exposes H1-H6, lists, marks (incl. code / underline / strike), inline images, links, and 9 fancy module types.
- **Seed demo content** — `pnpm seed` populates 47 docs incl. a showcase article that exercises every single editor primitive.

When `features.blog: false`, every route above 404s, sitemap drops the entry, the header link disappears, and `/studio` is the only Sanity surface that stays — useful for content prep before launch.

## Documentation — two VitePress sites

Each is its own npm package, isolated from the pnpm workspace:

**Product docs** — how the template works ([`code/docs/`](./code/docs/)):

```bash
pnpm docs:install   # once
pnpm docs           # → http://localhost:3002
pnpm docs:build     # → code/docs/.vitepress/dist
```

**Method / framework** — how we work, the dev framework ([`method/`](./method/)):

```bash
pnpm method:install # once
pnpm method         # → http://localhost:3003
pnpm method:build   # → method/.vitepress/dist
```

Full product-docs index — every guide in [`code/docs/`](./code/docs/), grouped by area.

**Setup & operations**

| Doc                                                       | Covers                                             |
| --------------------------------------------------------- | -------------------------------------------------- |
| [`environment.md`](./code/docs/setup/environment.md)           | Clone → running: app deps + optional AI toolchain  |
| [`new-client.md`](./code/docs/setup/new-client.md)             | Fork the template for a new client site            |
| [`brand-setup.md`](./code/docs/setup/brand-setup.md)           | Colours, fonts, logo, social links, brand assets   |
| [`launch-checklist.md`](./code/docs/setup/launch-checklist.md) | Take the site from "dev is done" to live + indexed |
| [`operations.md`](./code/docs/setup/operations.md)             | Run the site day-to-day, forms, fixes              |
| [`scripts.md`](./code/docs/setup/scripts.md)                   | The `pnpm` scripts and what they do                |
| [`codegraph.md`](./code/docs/setup/codegraph.md)               | Opt-in local semantic index for AI coding agents   |
| [`headroom.md`](./code/docs/setup/headroom.md)                 | Opt-in context compression for AI coding agents    |
| [`behavior-plugins.md`](./code/docs/setup/behavior-plugins.md) | caveman (terse output) + ponytail (least code)     |
| [`maintenance-mode.md`](./code/docs/setup/maintenance-mode.md) | Take the site offline gracefully                   |

**Configuration & architecture**

| Doc                                                                      | Covers                                               |
| ------------------------------------------------------------------------ | ---------------------------------------------------- |
| [`project-organization.md`](./code/docs/config/project-organization.md)       | How the repo is laid out — where things live         |
| [`feature-flags.md`](./code/docs/config/feature-flags.md)                     | Every `features` toggle + route gating               |
| [`i18n-and-routing.md`](./code/docs/config/i18n-and-routing.md)               | Languages, URL prefix modes, locale detection, slugs |
| [`theme-modes.md`](./code/docs/config/theme-modes.md)                         | Light / dark / system + forced themes                |
| [`migration-feature-based.md`](./code/docs/config/migration-feature-based.md) | Plan: migrate to a feature-based folder structure    |

**Design & content**

| Doc                                                          | Covers                                        |
| ------------------------------------------------------------ | --------------------------------------------- |
| [`design-decisions.md`](./code/docs/design-decisions.md)          | Why key visual/UI choices were made (ADR log) |
| [`sections.md`](./code/docs/design/sections.md)                   | Copying + mounting section components         |
| [`typography.md`](./code/docs/design/typography.md)               | Type scale, text styles + the font registry   |
| [`responsive-design.md`](./code/docs/design/responsive-design.md) | Breakpoints and responsive conventions        |
| [`icons.md`](./code/docs/design/icons.md)                         | UI icon sets + favicon / apple-touch / PWA    |
| [`featured-articles.md`](./code/docs/design/featured-articles.md) | The featured-articles home section            |
| [`video-embeds.md`](./code/docs/design/video-embeds.md)           | Embedding video                               |
| [`error-pages.md`](./code/docs/design/error-pages.md)             | Error + not-found pages                       |

**SEO & discovery**

| Doc                                                                     | Covers                                            |
| ----------------------------------------------------------------------- | ------------------------------------------------- |
| [`seo-metadata.md`](./code/docs/seo/seo-metadata.md)                         | How `<head>` metadata is generated (translatable) |
| [`editing-seo-in-sanity.md`](./code/docs/seo/editing-seo-in-sanity.md)       | Edit SEO / OG / llms / structured data in Studio  |
| [`structured-data-cookbook.md`](./code/docs/seo/structured-data-cookbook.md) | Per-page JSON-LD recipes + business-type presets  |
| [`faq.md`](./code/docs/seo/faq.md)                                           | Per-page FAQ → display + FAQPage JSON-LD + llms   |
| [`llms-endpoints.md`](./code/docs/seo/llms-endpoints.md)                     | `/llms.txt`, `/llms-full.txt`, `/llms/<id>`       |
| [`robots-and-environments.md`](./code/docs/seo/robots-and-environments.md)   | Env-aware robots.txt + production origin from env |
| [`analytics.md`](./code/docs/seo/analytics.md)                               | Analytics + Consent Mode setup                    |
| [`security-headers.md`](./code/docs/seo/security-headers.md)                 | CSP + security headers                            |

**Blog (when `features.blog: true`)**

| Doc                                                                 | Covers                                               |
| ------------------------------------------------------------------- | ---------------------------------------------------- |
| [`sanity-setup.md`](./code/docs/features/blog/sanity-setup.md)           | Set up Sanity — env vars, CORS, QA matrix            |
| [`editor-guide.md`](./code/docs/features/blog/editor-guide.md)           | Publish your first post as a content editor          |
| [`body-editor.md`](./code/docs/features/blog/body-editor.md)             | What the body editor can do (styles, marks, modules) |
| [`gallery.md`](./code/docs/features/blog/gallery.md)                     | Image gallery module — carousel + zoom lightbox      |
| [`blog-architecture.md`](./code/docs/features/blog/blog-architecture.md) | Extend or remove a module as a developer             |
| [`sanity-tokens.md`](./code/docs/features/blog/sanity-tokens.md)         | Mint / rotate Sanity API tokens                      |

**Client intake forms** — fill-in questionnaires in [`docs/client-intake/`](./code/docs/client-intake/) to send to clients so they can supply their own SEO copy, business details, AI-index summary, and FAQ (each per language).

## How it's organised

```
messages/<locale>.json    Single source of truth for ALL user-facing copy
src/
├── app/
│   ├── layout/          Production chrome — DefaultLayout, Header, Footer, SkipLink,
│   │                     CookieBanner + Logo, LocaleSwitcher, ThemeToggle, ThemeProvider
│   ├── [locale]/         Routes — `(home)`, `legal`, error, not-found, llms.txt, llms-full.txt, llms/[id]
│   └── routes.ts         Auto-aggregates `pages` map → ROUTES + PATHNAMES
├── components/
│   ├── ui-primitives/    shadcn/ui (READ-ONLY, CLI-managed)
│   ├── sections/         Production section components — copy here from the library
│   └── pages/            Full-page composites (Error, NotFound)
├── config/
│   ├── index.ts          PURE DATA — site, theme, locales, features, seo, pages, …
│   └── types.ts          Types + helpers (definePage, isLocale, …)
├── hooks/                Production hooks (use-mobile)
├── i18n/                 Routing + request handler (loads messages/<locale>.json)
└── lib/
    ├── scoped-t.ts             useScopedT hook for section i18n
    ├── metadata.ts             buildMetadata({ page, locale }) — inherits site → page
    └── seo/
        ├── jsonld.tsx              Auto-emitted: Organization + WebSite + WebPage
        ├── jsonld-factories.tsx    On-demand: FAQ, Article, Service, Product, …
        └── page-markdown.ts        Backs /llms.txt + /llms-full.txt + /llms/<id>
```

## Adding a page

1. Folder under `src/app/[locale]/<seg>/` with a `page.tsx`
2. Entry in `pages` map (`code/apps/web/src/config/index.ts`): `{ key, id, slug, seo: { keywords } }`
3. Key in `AppPathname` (`src/config/types.ts`)
4. `pages.<id>.title` + `pages.<id>.description` in every `messages/<locale>.json`

Everything else propagates — sitemap, routing, llms.txt, SEO metadata, JSON-LD.

## Adding a section

1. Browse the sibling **[indiecrafts-library](../indiecrafts-library)** (`pnpm storybook`) and find a section variant.
2. Copy its `Component.tsx` into `src/components/sections/<Name>.tsx`. If it ships a multi-file folder, flatten the schema + config into one file as you copy. See `src/components/sections/Features.tsx` for the target shape.
3. Drop its sample copy (`en.json`) into `messages/<locale>.pages.<id>.blocks.<simpleName>`. Drop the `-NN` variant suffix — production keys are clean.
4. Mount it in your route's `page.tsx` with explicit `*Key` props pointing at those keys. See `src/app/[locale]/(home)/page.tsx` for the live pattern.

The library is **never imported at runtime** — it's a Storybook-only browse surface. The /app ships only the section files you've copied in.

## i18n

Single flat file per locale:

```jsonc
{
  "nav": { … }, "cta": { … }, "footer": { … }, "common": { … }, "validation": { … },
  "site": { "tagline": "…", "description": "…" },
  "pages": {
    "home": {
      "title": "…", "description": "…",
      "blocks": { "features": { … }, "cta": { … }, "pricing": { … } }
    }
  }
}
```

Adding a locale = one row in `locales` (`config/index.ts`) + matching `messages/<code>.json`. Routes, sitemap, switcher all pick it up automatically.

## SEO

Per-locale, every page automatically gets:

- `<title>` + `<meta description>` (from `pages.<id>.title` / `.description`)
- canonical + hreflang × all locales + x-default
- og:_ / twitter:_ (title, description, locale, image:alt — all locale-correct)
- JSON-LD: `Organization` + `WebSite` + `WebPage` (descriptions per locale)

Override per page via `pages.<id>.seo` (keywords, noindex, openGraph.imageUrl, structuredData).

**`NEXT_PUBLIC_SITE_URL` MUST be set in production** — when unset, `robots.ts` serves `Disallow: /` (staging gate).

### Per-page extras

Add `structuredData` to a page's SEO for rich results. Factories in `@/lib/seo/jsonld-factories`:

```ts
import { buildFAQPageSchema } from "@/lib/seo/jsonld-factories";

pages: {
  pricing: {
    key: "/pricing", id: "pricing", slug: "/pricing",
    seo: {
      structuredData: [
        buildFAQPageSchema([
          { question: "How does pricing work?", answer: "…" },
        ]),
      ],
    },
  },
}
```

Available: `buildFAQPageSchema`, `buildArticleSchema`, `buildServiceSchema`, `buildProductSchema`, `buildLocalBusinessSchema`, `buildPersonSchema`, `buildBreadcrumbSchema`. **FAQ is the highest-ROI rich result** for B2B. Copy-paste recipes: [`docs/seo/structured-data-cookbook.md`](./code/docs/seo/structured-data-cookbook.md).

### Brand assets

**All brand assets are edited in Sanity** (Studio → SEO & métadonnées) — the logo
(`siteSettings.logo` / `logoDark`), favicon/app icon (`siteSettings.icon`), and the
Open Graph card per language (`siteMeta.<locale>.ogImage`). Nothing brand-related
lives in `/public`; `pnpm seed` uploads the defaults from `scripts/seed-media/`.
See [`editing-seo-in-sanity.md`](./code/docs/seo/editing-seo-in-sanity.md).

## LLM endpoints

All per-locale, all auto-built from `messages.<locale>.pages.*` — no separate config:

- `/<locale>/llms.txt` — site summary + page list ([llmstxt.org](https://llmstxt.org) spec)
- `/<locale>/llms-full.txt` — every page's content concatenated as Markdown
- `/<locale>/llms/<id>` — single page as Markdown

## Deployment (Netlify)

1. Push the repo to GitHub / GitLab.
2. Netlify dashboard → Add new site → Import from Git → pick the repo.
3. Build settings are pre-filled from `netlify.toml` (build: `pnpm build`, publish: `.next`). Netlify auto-detects Next.js and installs `@netlify/plugin-nextjs`.
4. **Edit `code/apps/web/src/config/index.ts`** before the first deploy: set `site.url` to your Netlify URL (or custom domain). The template ships with `https://example.com` as a placeholder, which flips `robots.ts` to `Disallow: /` — that's the staging gate, swap it for the real URL when ready to be indexed.
5. Env vars (all optional) live in Netlify → Site settings → Environment variables. See `.env.example`.

Branch deploys, deploy previews, and rollbacks all work out of the box.

## Forms (Netlify Forms — zero backend)

Submissions are stored on Netlify and visible in the dashboard → Forms. No API route, no Resend/SendGrid setup.

**How it's wired:**

- `public/__forms.html` declares each form schema (Netlify's HTML parser only scans static files; Next.js dynamic pages don't count). Add a `<form>` block here for every form your site renders.
- React forms include a matching `name`, `data-netlify="true"`, a hidden `<input name="form-name" />`, and a honeypot `<input name="bot-field" />`. They POST URL-encoded data to `/`; Netlify routes by `form-name`.

The library ships ready-to-copy newsletter + contact section variants — pick one, copy in, and Netlify scans `public/__forms.html` at build time.

Set up email/Slack notifications in Netlify dashboard → Forms → Settings. Local dev posts to the dev server and quietly fails — test forms by pushing to a Netlify branch preview.

## Cookie banner + legal page (feature-flagged)

Both default OFF — turn on in `code/apps/web/src/config/index.ts` under `features`:

```ts
features: {
  cookieBanner: false,    // bottom-fixed Accept/Reject banner + GA Consent Mode
  legalPage: false,       // /legal route — privacy, cookies, terms, contact
}
```

**When `cookieBanner: true`:**

- A minimal banner renders bottom-fixed at first visit (and on `?cookies=manage`).
- Stores choice in `localStorage["cookie-consent"]` as `"accepted"` or `"rejected"`.
- If `analytics.googleAnalyticsId` is also set, GA loads with [Consent Mode v2](https://developers.google.com/tag-platform/security/guidance/consent-mode) `denied` defaults and is flipped to `granted` only on accept.
- Without GA, the banner is still legally honest — it makes consent visible.
- Copy lives in `messages.<locale>.cookies.*`.

**When `legalPage: true`:**

- `/legal` route is enabled (sitemap, routing, llms.txt all pick it up — the `pages.legal.enabled` field mirrors the flag).
- Content from `messages.<locale>.pages.legal.*` — 4 sections (privacy, cookies, terms, contact) you can edit, remove, or extend by adjusting both the JSON and the `SECTIONS` list in `src/app/[locale]/legal/page.tsx`.

For most B2B sites with **no analytics**, leave both off — strictly-necessary cookies don't require consent under GDPR.

For EU traffic with GA enabled, turn both on.

## Critical rules

- Never inline user-facing strings — use messages
- Never `import Link from "next/link"` — use `@/i18n/routing`
- Never edit `src/components/ui-primitives/**` (shadcn-managed)
- Never depend on `../indiecrafts-library` at runtime — that repo is browse-only
- Always `setRequestLocale(locale)` in server components that use translations
- Always run `pnpm verify:quick` before opening a PR (no pre-push hook — the commit hook runs `tsc` + staged lint)
