# indiecrafts.dev — CLAUDE.md

Config-first, modular Next.js 16 template for client sites. Production-only — the Storybook component library lives in the sibling repo `../indiecrafts-library`.

## Working principles

1. Don't assume. Surface tradeoffs. Don't hide confusion.
2. Minimum code that solves the problem. Nothing speculative.
3. Touch only what you must.
4. Define success criteria. Loop until verified.
5. Simplify wherever you can.

## Commands

```bash
pnpm dev / build / tsc / lint / format    # standard
pnpm verify                               # CI gate (tsc + lint + format + contrast)
pnpm verify:quick                         # tsc + lint (pre-push)
```

Pre-push hook: `lint && tsc`. Pre-commit: `lint-staged`.

## Architecture

```
src/config/index.ts        Pure data — site, theme, locales, features, navigation, seoDefaults, llms, pages, globalSchemas, analytics
src/config/types.ts        Types + helpers (definePage, isLocale, …)

src/app/layout/           Production chrome: DefaultLayout, Header, Footer, SkipLink, CookieBanner,
                           Logo, LocaleSwitcher, ThemeToggle, ThemeProvider
src/app/[locale]/<seg>/    One route per folder (page.tsx). Home = (home) route group.
src/app/routes.ts          Auto-aggregates `pages` map → ROUTES + PATHNAMES

src/components/
   ui-primitives/          shadcn (READ-ONLY, CLI-managed)
   sections/               Production sections — copy targets from the sibling library
   pages/                  Full-page composites (Error, NotFound)

src/hooks/                 Production hooks (use-mobile)
src/lib/
   scoped-t.ts             useScopedT for sections that take MessageKey overrides
   metadata.ts             buildMetadata({ page, locale }) — inherits site → page
   logger.ts               Minimal logger — never use console.* directly
   seo/
     jsonld.tsx            Auto-emitted: Organization + WebSite + WebPage
     jsonld-factories.tsx  On-demand: FAQ, Article, Service, Product, LocalBusiness, Person, Breadcrumb
     page-markdown.ts      Backs /llms.txt + /llms-full.txt + /llms/<id>

src/sanity/                Sanity client + Studio wiring
   env.ts                  projectId / dataset / apiVersion (NEXT_PUBLIC_SANITY_*)
   client.ts               Read client for RSC queries (useCdn: false)
   Studio.tsx              "use client" wrapper around <NextStudio>
   queries.ts              GROQ — allPostsQuery, postBySlugQuery, allPostSlugsQuery
   types.ts                Post, PostListItem, AuthorRef, CategoryRef
   image.ts                urlFor(source) — Sanity image URL builder
   schema/                 post / author / category / blockContent

sanity.config.ts           Studio config — registers schema types, plugins
src/app/studio/            Embedded Studio at /studio (catch-all route)

messages/<locale>.json     Single flat tree — chrome + pages.<id>.{title, description, blocks}
```

## i18n: single source of truth

`messages.<locale>.pages.<id>.*` powers EVERYTHING per page: SEO `<title>`/description, canonical, og/twitter, JSON-LD WebPage, llms.txt entries.

```jsonc
{
  "nav": { … }, "common": { … }, "site": { "tagline": "…", "description": "…" },
  "pages": {
    "home": {
      "title": "…",
      "description": "…",
      "blocks": {
        "features": { … },   // block keys drop the -NN variant suffix
        "cta":      { … }
      }
    }
  }
}
```

- Drop variant suffix in production keys: library's `sections-features/features-01/` → `pages.home.blocks.features`.
- Same block on multiple pages = duplicate copy under each page (cheap, independent).
- Adding a locale: append to `locales` array + drop `messages/<code>.json`.

## Adding a page

1. `src/app/[locale]/<seg>/page.tsx`
2. Entry in `pages` (config/index.ts): `{ key, id, slug, seo: { keywords } }`
3. Key in `AppPathname` (`src/config/types.ts`)
4. `pages.<id>.title` + `pages.<id>.description` in every `messages/<locale>.json`

Propagates automatically: sitemap, routing, llms.txt × locales, SEO metadata, JSON-LD WebPage.

## Adding a section to a route

The /app does NOT import the library at runtime — they're two separate repos. To add a section:

1. Open Storybook in the sibling library (`cd ../indiecrafts-library && pnpm storybook`).
2. Find the variant you want. Copy its component file into `src/components/sections/<Name>.tsx`. If the upstream ships a multi-file folder (schema.ts + config.ts + en.json), flatten everything into one .tsx file as you copy. See `src/components/sections/Features.tsx` for the target shape.
3. Drop the matching `en.json` content into `messages/<locale>.pages.<id>.blocks.<simpleName>` (drop -NN).
4. Mount in the route's `page.tsx` with explicit `*Key` props pointing at the new keys.

See `src/app/[locale]/(home)/page.tsx` for the live pattern.

## SEO + JSON-LD

**Inheritance chain (lowest → highest precedence):**

1. `site.*` (brand, url, social)
2. `seoDefaults.*` (titleTemplate, robots, OG type/siteName, twitter card, verification)
3. Auto-derived from `page.id`: titleKey, descriptionKey, og:image=`/brand/og-<id>.png`, canonical
4. `page.seo.*` overrides

`buildMetadata({ page, locale })` (`@/lib/metadata`) composes the chain. Layout uses `generateMetadata` so site-wide metadata is also locale-aware.

**Auto-emitted JSON-LD:** Organization, WebSite (layout), WebPage (per page via `<PageSchemas>`). Per-page extras → `page.seo.structuredData[]` using factories from `@/lib/seo/jsonld-factories`. Cookbook in `docs/seo/structured-data-cookbook.md`.

**FAQ is the highest-ROI rich result** for B2B. Wire it via `buildFAQPageSchema(...)`.

## LLM endpoints

`/<locale>/llms.txt`, `/<locale>/llms-full.txt`, `/<locale>/llms/<id>` — all auto-built from `messages.<locale>.pages.*`. **Zero per-page config.** Add a page → it appears in all three, in every locale.

## Sanity + blog (feature-flagged)

The template ships a Sanity-backed blog with a page-builder system **scoped to the blog only**. Two independent flags in `config/index.ts` govern it:

- **`features.blog`** — the public surface. `false` ⇒ every public blog route 404s and drops from sitemap + llms.txt + header nav (see the flag list below).
- **`features.studio`** — the editing surface (Studio at `/studio` + draft-mode preview). Independent of `features.blog`: keep the Studio on with `blog: false` so editors keep working while the public surface is hidden, or turn it off to lock editing on a frozen site.

Public-blog route gating is centralized in `@/lib/feature-gate` — `requireBlogRoute(page)` for page components, `isBlogRouteEnabled(page)` for route handlers. Both fold in the `features.blog` flag **and** the page's `enabled` field, so a new blog route can't drift by checking only one.

**Schemas** (in `src/sanity/schema/`):

| Surface      | Documents                                               | Objects                                     |
| ------------ | ------------------------------------------------------- | ------------------------------------------- |
| Blog         | `blog` (singleton), `post`, `author`, `category`, `tag` | `blockContent`, `metadata`                  |
| Module refs  | `quote`, `person`                                       | `link`, `cta`                               |
| Page-builder | —                                                       | 14 `module.*` types (see `schema/modules/`) |

**Studio at `/studio`** — embedded catch-all at `src/app/studio/[[...tool]]/page.tsx`. Studio root layout at `src/app/studio/layout.tsx` (catch-all sits outside `[locale]/`, so it needs its own `<html>`/`<body>`). The sidebar groups Blog (singleton + posts/authors/categories) and References (quotes/people).

**The `blog` singleton owns the per-post chrome via `postModules[]`.** When the array is empty, every `/blog/[slug]` falls back to `DefaultPostLayout` (full-width hero with cover image touching the nav, sticky TOC sidebar, rounded body panel, "Keep reading" related-posts grid). The frontpage at `/blog` is **never** module-driven — chrome stays uniform by design.

**Modules** (all 14 are `object` types, all gated by the blog feature):

- **Inline-embeddable in post body + usable in `postModules`** (8): accordion-list, callout, card-list, custom-html, person-list, quote-list, stat-list, step-list
- **`postModules`-only** (6): breadcrumbs, blog-index, blog-post-content, blog-post-list, prose, search

The inline allowlist lives in `src/sanity/schema/blockContent.ts` (`INLINE_MODULES`). Removing a module = remove from both that list AND from the renderer's `types` map in `portable-text-components.tsx`.

**Renderer**: `src/components/blog-components/modules/ModuleRenderer.tsx` switches on `_type` and hands off to one of 14 small components. Adding a module = new schema + new component + new case in the switch (TS exhaustiveness check enforces).

**Queries** (`src/sanity/queries.ts`) use `defineQuery` (typegen-ready). `MODULES_FRAGMENT` expands every reference per module type. Always fetch through `sanityFetchLive` (draft-mode aware) or `@/sanity/client` — never instantiate a new `createClient`.

**Live preview + draft mode**: `defineLive` in `src/sanity/live.ts`. `<SanityLive />` is mounted in the layout (only when feature flag is on). `/api/draft-mode/enable` + `/api/draft-mode/disable` toggle the perspective. Requires `SANITY_API_READ_TOKEN`.

**Per-post extras**:

- `metadata.{title,description,image,slug,noIndex}` overrides the page `<head>`.
- `body` PortableText drives a Table of Contents (`<Toc>`) — h2/h3/h4 headings auto-fetched in GROQ via `pt::text()`.
- `readTime` derived in GROQ (`length(string::split(...)) / 200`).
- Article JSON-LD via `buildArticleSchema(...)`.
- Markdown export at `/<locale>/blog/<slug>/md` — frontmatter + PortableText→Markdown serializer (`src/sanity/portable-to-markdown.ts`). Advertised via `<link rel="alternate" type="text/markdown">`.
- RSS at `/<locale>/blog/rss.xml` (also advertised via alternate link).

**`features.blog`** (public surface) gates:

- All public routes via `@/lib/feature-gate`: `/blog`, `/blog/[slug]`, `/blog/category` + `/[slug]`, `/blog/tag` + `/[slug]`, `/author` + `/[slug]`, plus the `/blog/[slug]/md` + `/blog/rss.xml` handlers — 404 when off.
- `pages.{blog,author,category,tag}.enabled` mirror the flag — sitemap + llms.txt drop the entries automatically.
- `headerNav` adds the `/blog` link only when on.
- `<SanityLive />` only mounted when on (it revalidates public blog pages).
- `generateStaticParams` returns `[]` for every dynamic blog route when off — build stays fast.

**`features.studio`** (editing surface) gates:

- `/studio` (the embedded Studio) — 404s when off.
- `/api/draft-mode/enable` + `/disable` — 404 when off.

To wire Sanity to your project, set `NEXT_PUBLIC_SANITY_PROJECT_ID` + `NEXT_PUBLIC_SANITY_DATASET` (see `.env.example`). The CSP in `next.config.ts` already allows `https://*.sanity.io` + `wss://*.api.sanity.io`.

## Theming + accessibility

- Tailwind v4 + CSS vars. Tokens in `theme.*` (config/index.ts), mirrored in `globals.css` as `oklch(...)`.
- Two dark triggers: `html[data-theme="dark"]` → `@media (prefers-color-scheme: dark)`. `@custom-variant dark` on the attribute.
- `pnpm verify:contrast` asserts WCAG AA on theme tokens. Run after every theme change.
- `next/og` (Satori) doesn't understand oklch → keep `theme.hexColors` in sync with `theme.colors` for the brand/foreground pairs.
- `<html lang>` + `dir` from active locale. `SkipLink` first in body, targets `#main`. Layouts render exactly one `<main id="main" tabIndex={-1}>`. Sections: `<section aria-labelledby="…">`. Icons `aria-hidden="true"` unless they're the sole label. Respect `prefers-reduced-motion`.

## Relationship to the library

- The library at `../indiecrafts-library` is a Storybook-only browse surface. The /app has **zero runtime imports** from it.
- Workflow when the library improves a component: re-copy the file by hand, re-run `pnpm verify:quick`.
- Don't add the library as a workspace, dependency, or symlink — keeping them decoupled is the design.

## Critical rules (the NEVERs)

- NEVER commit `.env*` (only `.env.example`).
- NEVER hard-code brand strings, URLs, colors, or nav entries — read from `@/config`.
- NEVER import from `next/link` or `next-intl/navigation` — use `@/i18n/routing`.
- NEVER inline user-facing strings — every visible string lives in `messages/<locale>.json`.
- NEVER add `as any` — fix the type, or eslint-disable with a one-line reason.
- NEVER edit `src/components/ui-primitives/**` (shadcn — managed via CLI).
- NEVER depend on `../indiecrafts-library` at runtime — it's browse-only, copy what you need.
- NEVER swallow errors — `logger.error(...)` minimum.
- NEVER set state inside `useEffect` to mark hydration — use `useSyncExternalStore`.
- NEVER instantiate a Sanity `createClient` per route — use `@/sanity/client`.
- NEVER expose `SANITY_API_READ_TOKEN` (or any non-public Sanity token) under a `NEXT_PUBLIC_` prefix.
- ALWAYS `setRequestLocale(locale)` at the top of server components using translations or metadata.
- ALWAYS run `pnpm verify:quick` before push.

## File-size discipline

- Components < 200 lines. Split at the natural seam.
- Page templates < 150 lines.
- Config files exempt — as long as the data requires.

## Verification (CI runs all of these)

1. `pnpm tsc` — strict, no emit
2. `pnpm lint` — zero errors
3. `pnpm format:check`
4. `pnpm verify:contrast` — WCAG AA on theme tokens
5. `pnpm build` — prerenders every static route × locale

Treat warnings as errors in /app + /lib + /config. A clean tree is a shippable tree.
