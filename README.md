# indiecrafts.dev

Config-first, modular Next.js 16 template for client sites. Edit `src/config/*`, compose sections from `src/components/` into `src/app/[locale]/<route>/page.tsx`, ship.

**Stack**: Next.js 16 · React 19 · TypeScript strict · Tailwind v4 · next-intl v4 · next-themes · Zod · Storybook 10 · shadcn/ui.

Conventions, naming rules, and the layer spine live in [`CLAUDE.md`](./CLAUDE.md) — read that before making non-trivial changes.

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm verify       # full CI gate (tsc + lint + format + contrast + pages + styles + routes)
```

## Commands

```bash
pnpm dev / build / tsc / lint / format / test    # standard
pnpm gen                                          # regen styles + routes
pnpm gen:styles / gen:routes                      # individual codegens
pnpm new:page <id>                                # scaffold route + messages
pnpm storybook                                    # browse the /components examples library
pnpm verify / verify:quick                        # CI gate / tsc + lint only
```

## Customizing

1. Edit `src/config/*` first — site metadata, theme tokens, navigation, routes, feature flags, SEO defaults.
2. Edit `messages/<locale>.json` for all user-facing copy (chrome + page content + section copy).
3. Compose sections into routes under `src/app/[locale]/<route>/page.tsx`. `/components` is an examples library — pick a section, copy its sample into your route with production key paths (see workflow below). Delete the `/components/<bucket>/<variant>/` folders you'll never use.

## i18n: the message tree

A single flat file per locale — `messages/<locale>.json` — drives everything the app shows. No build-time merge, no per-route message folders, no per-block aggregation.

```jsonc
{
  // Cross-cutting chrome (loaded on every route)
  "nav": { … }, "cta": { … }, "footer": { … }, "common": { … },
  "typography": { … }, "validation": { … }, "llms": { … },

  // One key per route — page metadata + nested blocks
  "pages": {
    "home": {
      "title": "…",          // <title> / SEO
      "description": "…",     // <meta name=description>
      "blocks": {
        "features":     { /* copy for the Features section mounted on / */ },
        "cta":          { … },
        "pricing":      { … },
        "testimonials": { … }
      }
    }
    // "about": { "blocks": { "features": { … its own copy … } } }
  }
}
```

**The same block can appear on multiple pages** — each page owns its copy under `pages.<routeId>.blocks.<simpleName>`. Duplicate is cheap; routes stay independent.

**Block keys drop the variant suffix.** `/components/sections-features/features-01/` becomes `pages.home.blocks.features` in production messages (no `-01`). The variant suffix only exists inside the `/components` examples library.

`MessageKey` is derived from `messages/en.json` — autocomplete suggests known paths, typos are caught when you use a known prefix.

## Migrating a section from /components into the app

`/components` is a library of section examples that render standalone inside Storybook. Production use is a small, manual migration:

1. **Pick a section** by browsing Storybook (`pnpm storybook`).
2. **Decide which route mounts it.** For the home page, that's `src/app/[locale]/page.tsx` and the route id is `home` (from `page.config.ts`).
3. **Copy the block's copy into `messages/<locale>.json`** under `pages.<routeId>.blocks.<simpleName>`. The simple name drops the variant suffix:

   | Source in /components                   | Destination in messages/en.json |
   | --------------------------------------- | ------------------------------- |
   | `sections-features/features-01/en.json` | `pages.home.blocks.features`    |
   | `sections-cta/cta-03/en.json`           | `pages.home.blocks.cta`         |
   | `sections-pricing/pricing-02/en.json`   | `pages.home.blocks.pricing`     |

   Mirror the same structure in every other locale file (`fr.json`, etc.).

4. **Mount the section in the route's `page.tsx`** with explicit `*Key` props pointing at the new paths:

   ```tsx
   import { Features01Section } from "@/components/sections-features/features-01";

   const BLOCKS = "pages.home.blocks";

   <Features01Section
     type="features-01"
     id="home-features"
     titleKey={`${BLOCKS}.features.title`}
     bodyKey={`${BLOCKS}.features.body`}
     items={[
       {
         iconKey: "zap",
         titleKey: `${BLOCKS}.features.items.customizable.title`,
         bodyKey: `${BLOCKS}.features.items.customizable.body`,
       },
       // … one entry per item in the block's en.json
     ]}
   />;
   ```

   **Don't spread the `*Sample` import** from the block's `config.ts` — that sample points at `blocks.<name>-NN.*` which only exists inside Storybook. Production routes pass `pages.<routeId>.blocks.<simpleName>.*` paths explicitly.

5. **Update the route's `page.config.ts`** to point SEO at the new keys:

   ```ts
   seo: {
     titleKey: "pages.home.title",
     descriptionKey: "pages.home.description",
   }
   ```

See `src/app/[locale]/page.tsx` for the home page using this exact pattern (Features, CTA, Pricing, Testimonials).

## Routes & chrome

Routes live under `src/app/[locale]/<seg>/`. The `(home)` route group holds `/`. Each route has just a `page.tsx` (config + composition). The page's data — key, slug, SEO — lives centrally in the `pages` map in `src/config/index.ts`.

Adding a route:

1. Create folder under `src/app/[locale]/<seg>/` with `page.tsx`
2. Add an entry in `pages` (config/index.ts): `{ key, id, slug, seo: { keywords } }`
3. Add the key to `AppPathname` in `src/config/routes.types.ts`
4. Add `pages.<id>.title` + `pages.<id>.description` (and any block copy) in every `messages/<locale>.json`

Everything else propagates automatically — sitemap, routing, llms.txt, SEO metadata, JSON-LD.

**Chrome is forked into `src/app/_chrome/`** (DefaultLayout, Header, Footer, SkipLink). `/app` does NOT import layouts from `/components` — production chrome is a fork, free to drift from the examples library. Atoms (Logo, LocaleSwitcher, ThemeToggle) are still shared from `/components/layouts/_shared/`.

## SEO + LLMs

The template ships production-grade SEO out of the box. **Set `NEXT_PUBLIC_SITE_URL` in production** — when unset, `robots.ts` serves `Disallow: /` so preview/staging stays out of search.

### What's emitted per locale

For every page, on every locale (en, fr, …):

| Surface                                        | Source                                                                                           | Locale-aware?            |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------ |
| `<title>` + `<meta description>`               | `messages.<locale>.pages.<id>.title` / `.description`                                            | ✅                       |
| canonical + hreflang (all locales + x-default) | `getPathname({ locale })`                                                                        | ✅                       |
| `og:title`, `og:description`, `og:url`         | merged from title/description/canonical                                                          | ✅                       |
| `og:locale` + `og:locale:alternate`            | current + every other locale                                                                     | ✅                       |
| `og:image` + alt                               | `/brand/og-<id>.png` (drop a file, swap per page)                                                | URL same, alt per locale |
| `twitter:*`                                    | mirrors OG                                                                                       | ✅                       |
| `og:site_name`, `og:type`, `twitter:card`      | `seoDefaults` (re-emitted per page; Next.js metadata REPLACES the OG object, doesn't deep-merge) | constant                 |
| `robots` + `googlebot` directives              | `seoDefaults.robots` + per-page `seo.noindex`/`seo.robots`                                       | constant                 |
| JSON-LD `Organization`                         | `site.legal` + `messages.<locale>.site.description`                                              | ✅                       |
| JSON-LD `WebSite`                              | `site.name` + `messages.<locale>.site.description`                                               | ✅                       |
| JSON-LD `WebPage` (auto per page)              | page title/desc/url + `inLanguage`                                                               | ✅                       |
| Verification meta (Google, Bing)               | `seoDefaults.verification` (omitted when empty)                                                  | n/a                      |

### Per-page SEO config

In `src/config/index.ts`, each page entry can override anything:

```ts
pages: {
  pricing: {
    key: "/pricing",
    id: "pricing",
    slug: { en: "/pricing", fr: "/tarifs" },
    seo: {
      keywords: ["b2b pricing", "subscription tiers"],
      // openGraph.imageUrl  — defaults to /brand/og-pricing.png
      // noindex             — true for draft/private pages
      structuredData: [
        buildFAQPageSchema([
          { question: "How does pricing work?", answer: "Free for personal…" },
        ]),
        buildServiceSchema({ name: "Consulting", areaServed: "Worldwide" }),
      ],
    },
  },
}
```

Title and description auto-derive from `messages.<locale>.pages.<id>.title` / `.description` — no need to repeat them in the SEO block.

### JSON-LD factories (`@/lib/seo/jsonld`)

| Factory                                      | What it builds                        | Where to use                        |
| -------------------------------------------- | ------------------------------------- | ----------------------------------- |
| `buildOrganizationSchema()`                  | Org + address + contactPoint + sameAs | site-wide (auto in layout)          |
| `buildWebSiteSchema({ searchUrlTemplate? })` | WebSite + optional SearchAction       | site-wide (auto in layout)          |
| `buildWebPageSchema(...)`                    | Per-page WebPage with inLanguage      | per page (auto via `<PageSchemas>`) |
| `buildBreadcrumbSchema(items)`               | BreadcrumbList                        | per-page `seo.structuredData[]`     |
| `buildArticleSchema(...)`                    | Article (blog/content)                | per-page `seo.structuredData[]`     |
| `buildFAQPageSchema(items)`                  | FAQPage — **highest-ROI rich result** | per-page `seo.structuredData[]`     |
| `buildServiceSchema(...)`                    | Service + Offer                       | per-page (B2B services)             |
| `buildProductSchema(...)`                    | Product + Offer + AggregateRating     | per-page (e-commerce / SaaS)        |
| `buildLocalBusinessSchema(...)`              | LocalBusiness per location            | `globalSchemas` for multi-location  |
| `buildPersonSchema(...)`                     | Person (team pages)                   | per-page                            |

Add custom site-wide schemas in `globalSchemas` (config) — example LocalBusiness/Service/Product templates are included as commented blocks at that export.

### LLM endpoints (per locale)

Following the [llmstxt.org](https://llmstxt.org) spec + emerging Mintlify/Anthropic conventions:

| URL                                         | What it serves                                                       |
| ------------------------------------------- | -------------------------------------------------------------------- |
| `/llms.txt`, `/<locale>/llms.txt`           | Site summary + auto-built page list (title/url/description per page) |
| `/llms-full.txt`, `/<locale>/llms-full.txt` | All pages' content concatenated as Markdown                          |
| `/llms/<id>`, `/<locale>/llms/<id>`         | Single page rendered as Markdown                                     |

Every endpoint reads from the same `messages.<locale>.pages.<id>.*` keys SEO uses — **no parallel llms config to maintain.** Adding a page → it shows up in all three endpoints automatically, in every locale.

### Critical rules

- **Never** put SEO copy outside `messages/`. Title/description always come from i18n keys.
- **Always** check both `/` and `/fr/` (or your locales) when adding a page — the SEO/JSON-LD/llms output should differ correctly.
- **Run** `pnpm verify:quick` before push: catches typos in `MessageKey` keys and dead routes.
- For SEO debugging, fetch the page and `grep -E '<meta|<link rel="(canonical|alternate)"|<title>|application/ld'`.

### Brand assets

All image surfaces dispatch through `src/config/site.config.ts`. Replace the files in place — no code changes needed.

| File                                                                       | Role                                                                                | Surface                                                                               |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `public/logo.svg`                                                          | Primary favicon + UI logo                                                           | `<link rel="icon">` via `/icon` route                                                 |
| `public/brand/apple-icon.png` (180×180, opaque)                            | iOS home-screen icon                                                                | `<link rel="apple-touch-icon">` via `/apple-icon` route                               |
| `public/brand/icon-192.png` / `icon-512.png`                               | PWA install icons                                                                   | `manifest.webmanifest`                                                                |
| `public/brand/icon-maskable-512.png` (512×512 with ~10% safe-area padding) | Adaptive Android icon                                                               | `manifest.webmanifest` (`purpose: maskable`)                                          |
| `public/brand/logo.png` (square, ≥512×512)                                 | Schema.org `Organization.logo` (Google Knowledge Panel — PNG required, SVG ignored) | JSON-LD site-wide                                                                     |
| `public/brand/og.png` (1200×630)                                           | Global social card                                                                  | `og:image`, `twitter:image` via `/opengraph-image` route                              |
| `public/brand/og-<page>.png` (1200×630)                                    | Per-page social card                                                                | Set `seo.openGraph.imageUrl: "/brand/og-<page>.png"` in that route's `page.config.ts` |

Switch the favicon source by editing `siteConfig.icon` (e.g. swap the SVG for a 512×512 PNG). Switch the OG card by editing `siteConfig.ogImage` or by setting `mode: "generated"` for an auto-rendered branded card.

## Project structure

```
messages/                      ONE flat file per locale — everything the app shows
src/
├── app/
│   ├── _chrome/              FORKED chrome (DefaultLayout, Header, Footer, SkipLink)
│   ├── [locale]/             Each route owns page.config.ts + page.tsx in its folder
│   ├── sitemap.ts            Imports each route's pageConfig — hand-maintained list
│   └── …                     /opengraph-image, /icon, /apple-icon, /manifest, /llms.txt
├── config/                    site / theme / nav / features / locales / routes.types
├── components/                EXAMPLES LIBRARY (Storybook fodder; copy into /app to use)
│   ├── ui-primitives/         shadcn primitives (read-only)
│   ├── ui-effects/            decorative / animated effects
│   ├── ui-illustrations/      decorative React components
│   ├── ui-molecules/          shared molecule composites
│   ├── layouts/               example chrome variants (NOT loaded in production)
│   ├── sections-*/            content block examples
│   └── pages-*/               full-page composition examples
├── i18n/                      routing (PATHNAMES from page.config.ts) + request handler
├── lib/                       metadata, page-config types, logger, seo/jsonld, …
└── proxy.ts                   Next 16 locale routing
```
