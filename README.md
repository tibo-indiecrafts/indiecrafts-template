# indiecrafts.dev

Config-first Next.js 16 template for client sites. Edit `src/config/index.ts`, compose sections into your route, ship.

**Stack:** Next.js 16 · React 19 · TypeScript strict · Tailwind v4 · next-intl v4 · next-themes · shadcn/ui.

The sibling **[indiecrafts-library](../indiecrafts-library)** repo is a Storybook component library — browse it to find sections, then copy the file you want into `src/components/sections/` here. This /app stays decoupled and ships only what it uses.

Detailed conventions: [`CLAUDE.md`](./CLAUDE.md).

## Getting started

```bash
pnpm install
pnpm dev                # http://localhost:3000
pnpm verify             # tsc + lint + format:check + contrast (full CI gate)
pnpm verify:quick       # tsc + lint (pre-push)
```

## Blog (Sanity-powered, optional)

A full Sanity-backed editorial blog is wired into the template — feature-flagged so you can ship without it.

- **Turn it on** — set `features.blog: true` in `src/config/index.ts`, drop `NEXT_PUBLIC_SANITY_PROJECT_ID` + dataset into `.env.local`, run `pnpm dev`. Editor lives at <http://localhost:3000/studio>.
- **What you get** — `/blog`, `/blog/[slug]`, `/blog/category/[slug]`, `/blog/tag/[slug]`, `/author/[slug]`, RSS feed, Markdown export, draft preview, live content subscriptions, locale-filtered (EN + FR by default), embedded Sanity Studio at `/studio`.
- **Page-builder** — 14 modules (8 inline-embeddable inside post bodies, 6 layout-slot only). Editors compose post chrome from the `blog` singleton's `postModules` array; the body editor exposes H1-H6, lists, marks (incl. code / underline / strike), inline images, links, and 8 fancy module types.
- **Seed demo content** — `pnpm seed:blog` populates 47 docs incl. a showcase article that exercises every single editor primitive.

When `features.blog: false`, every route above 404s, sitemap drops the entry, the header link disappears, and `/studio` is the only Sanity surface that stays — useful for content prep before launch.

## Documentation

Guides grouped by what you're trying to do.

**Launch + operations**

| You want to…                                               | Read                                                     |
| ---------------------------------------------------------- | -------------------------------------------------------- |
| Take the site from "dev is done" to "live and indexed"     | [`docs/launch-checklist.md`](./docs/launch-checklist.md) |
| Run the site day-to-day, find form submissions, fix things | [`docs/operations.md`](./docs/operations.md)             |
| Change colours / fonts / logo / social links / assets      | [`docs/brand-setup.md`](./docs/brand-setup.md)           |

**Blog (when `features.blog: true`)**

| You want to…                                                   | Read                                                       |
| -------------------------------------------------------------- | ---------------------------------------------------------- |
| Set up Sanity for the first time, env vars, CORS, QA matrix    | [`docs/sanity-setup.md`](./docs/sanity-setup.md)           |
| Publish your first post as a content editor                    | [`docs/editor-guide.md`](./docs/editor-guide.md)           |
| Reference what the body editor can do (styles, marks, modules) | [`docs/body-editor.md`](./docs/body-editor.md)             |
| Extend or remove a module as a developer                       | [`docs/blog-architecture.md`](./docs/blog-architecture.md) |
| Mint / rotate Sanity API tokens                                | [`docs/sanity-tokens.md`](./docs/sanity-tokens.md)         |

**Other**

| You want to…                                          | Read                                                                     |
| ----------------------------------------------------- | ------------------------------------------------------------------------ |
| Fork the template for a new client site               | [`docs/new-client.md`](./docs/new-client.md)                             |
| Add rich-result JSON-LD (FAQ, Article, Service, etc.) | [`docs/structured-data-cookbook.md`](./docs/structured-data-cookbook.md) |

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
2. Entry in `pages` map (`src/config/index.ts`): `{ key, id, slug, seo: { keywords } }`
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

Available: `buildFAQPageSchema`, `buildArticleSchema`, `buildServiceSchema`, `buildProductSchema`, `buildLocalBusinessSchema`, `buildPersonSchema`, `buildBreadcrumbSchema`. **FAQ is the highest-ROI rich result** for B2B. Copy-paste recipes: [`docs/structured-data-cookbook.md`](./docs/structured-data-cookbook.md).

### Brand assets

Drop files into `public/`:

| File                                                | Role                                                   |
| --------------------------------------------------- | ------------------------------------------------------ |
| `public/logo.svg`                                   | Browser favicon + UI logo                              |
| `public/brand/apple-icon.png` (180×180, opaque)     | iOS home-screen icon                                   |
| `public/brand/icon-192.png` / `icon-512.png`        | PWA install                                            |
| `public/brand/icon-maskable-512.png` (~10% padding) | Adaptive Android icon                                  |
| `public/brand/logo.png` (square, ≥512×512)          | Schema.org Organization logo (Google rejects SVG here) |
| `public/brand/og.png` (1200×630)                    | Global Open Graph card                                 |
| `public/brand/og-<id>.png`                          | Per-page OG card (auto-detected by `id`)               |

## LLM endpoints

All per-locale, all auto-built from `messages.<locale>.pages.*` — no separate config:

- `/<locale>/llms.txt` — site summary + page list ([llmstxt.org](https://llmstxt.org) spec)
- `/<locale>/llms-full.txt` — every page's content concatenated as Markdown
- `/<locale>/llms/<id>` — single page as Markdown

## Deployment (Netlify)

1. Push the repo to GitHub / GitLab.
2. Netlify dashboard → Add new site → Import from Git → pick the repo.
3. Build settings are pre-filled from `netlify.toml` (build: `pnpm build`, publish: `.next`). Netlify auto-detects Next.js and installs `@netlify/plugin-nextjs`.
4. **Edit `src/config/index.ts`** before the first deploy: set `site.url` to your Netlify URL (or custom domain). The template ships with `https://example.com` as a placeholder, which flips `robots.ts` to `Disallow: /` — that's the staging gate, swap it for the real URL when ready to be indexed.
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

Both default OFF — turn on in `src/config/index.ts` under `features`:

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
- Always run `pnpm verify:quick` before push
