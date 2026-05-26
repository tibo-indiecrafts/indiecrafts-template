# indiecrafts.dev — CLAUDE.md

Config-first, modular Next.js 16 template for client sites.

## Working principles

1. Don't assume. Surface tradeoffs. Don't hide confusion.
2. Minimum code that solves the problem. Nothing speculative.
3. Touch only what you must.
4. Define success criteria. Loop until verified.
5. Simplify wherever you can.

## Commands

```bash
pnpm dev / build / tsc / lint / format / test    # standard
pnpm new:page <id>                                # scaffold a route
pnpm verify                                       # CI gate (tsc + lint + format + contrast)
pnpm verify:quick                                 # tsc + lint (pre-push)
pnpm storybook                                    # browse /components
```

Pre-push hook: `lint && tsc`. Pre-commit: `lint-staged`.

## Architecture

```
src/config/index.ts        Pure data (site, theme, locales, features, navigation, seoDefaults, llms, pages, globalSchemas, analytics)
src/config/types.ts        Types + helpers (definePage, isLocale, …)

src/app/_chrome/           PRODUCTION layout — forked from /components/layouts/, no /components imports
src/app/[locale]/<seg>/    One route per folder (page.tsx). Home = (home) route group.
src/app/routes.ts          Auto-aggregates `pages` map into ROUTES + PATHNAMES

src/components/            EXAMPLES library — Storybook fodder. Copy strings + mount in /app to use.
   ui-primitives/          shadcn (READ-ONLY, CLI-managed)
   ui-effects/             upstream effects (flat files = READ-ONLY; wrapper folders = editable)
   ui-molecules/           shared composites
   sections-<type>/        content blocks (one folder per variant)
   layouts/                example chrome variants — NOT loaded in production
   _shared/                atoms shared by layouts (Logo, LocaleSwitcher, ThemeToggle, …)

src/lib/seo/
   jsonld.tsx              Auto-emitted on every page: Organization + WebSite + WebPage
   jsonld-factories.tsx    On-demand: FAQ, Article, Service, Product, LocalBusiness, Person, Breadcrumb
   page-markdown.ts        Backs /llms.txt + /llms-full.txt + /llms/<id>

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

- Drop variant suffix in production keys: `/components/sections-features/features-01/` → `pages.home.blocks.features`.
- Same block on multiple pages = duplicate copy under each page (cheap, independent).
- Adding a locale: append to `locales` array + drop `messages/<code>.json`.

## Adding a page

1. `src/app/[locale]/<seg>/page.tsx`
2. Entry in `pages` (config/index.ts): `{ key, id, slug, seo: { keywords } }`
3. Key in `AppPathname` (`src/config/routes.types.ts`)
4. `pages.<id>.title` + `pages.<id>.description` in every `messages/<locale>.json`

Propagates automatically: sitemap, routing, llms.txt × locales, SEO metadata, JSON-LD WebPage.

## Adding a section to a route

1. Pick from `/components/sections-*/` (browse Storybook)
2. Copy its `en.json` into `messages.<locale>.pages.<id>.blocks.<simpleName>` (drop -NN)
3. Mount in route's `page.tsx` with explicit `*Key` props → `pages.<id>.blocks.<simpleName>.*`

See `src/app/[locale]/(home)/page.tsx` for the live pattern.

## SEO + JSON-LD

**Inheritance chain (lowest → highest precedence):**

1. `site.*` (brand, url, social)
2. `seoDefaults.*` (titleTemplate, robots, OG type/siteName, twitter card, verification)
3. Auto-derived from `page.id`: titleKey, descriptionKey, og:image=`/brand/og-<id>.png`, canonical
4. `page.seo.*` overrides

`buildMetadata({ page, locale })` (`@/lib/metadata`) composes the chain. Layout uses `generateMetadata` so site-wide metadata is also locale-aware.

**Auto-emitted JSON-LD:** Organization, WebSite (layout), WebPage (per page via `<PageSchemas>`). Per-page extras → `page.seo.structuredData[]` using factories from `@/lib/seo/jsonld-factories`. Cookbook in `docs/structured-data-cookbook.md`.

**FAQ is the highest-ROI rich result** for B2B. Wire it via `buildFAQPageSchema(...)`.

## LLM endpoints

`/<locale>/llms.txt`, `/<locale>/llms-full.txt`, `/<locale>/llms/<id>` — all auto-built from `messages.<locale>.pages.*`. **Zero per-page config.** Add a page → it appears in all three, in every locale.

## Theming + accessibility

- Tailwind v4 + CSS vars. Tokens in `theme.*` (config/index.ts), mirrored in `globals.css` as `oklch(...)`.
- Two dark triggers: `html[data-theme="dark"]` → `@media (prefers-color-scheme: dark)`. `@custom-variant dark` on the attribute.
- `pnpm verify:contrast` asserts WCAG AA on theme tokens. Run after every theme change.
- `next/og` (Satori) doesn't understand oklch → keep `theme.hexColors` in sync with `theme.colors` for the brand/foreground pairs.
- `<html lang>` + `dir` from active locale. `SkipLink` first in body, targets `#main`. Layouts render exactly one `<main id="main" tabIndex={-1}>`. Sections: `<section aria-labelledby="…">`. Icons `aria-hidden="true"` unless they're the sole label. Respect `prefers-reduced-motion`.

## Critical rules (the NEVERs)

- NEVER commit `.env*` (only `.env.example`).
- NEVER hard-code brand strings, URLs, colors, or nav entries — read from `@/config`.
- NEVER import from `next/link` or `next-intl/navigation` — use `@/i18n/routing`.
- NEVER inline user-facing strings — every visible string lives in `messages/<locale>.json`.
- NEVER add `as any` — fix the type, or eslint-disable with a one-line reason.
- NEVER edit `src/components/ui-primitives/**` (shadcn) or flat files in `src/components/ui-effects/*.tsx` (upstream).
- NEVER swallow errors — `logger.error(...)` minimum.
- ALWAYS `setRequestLocale(locale)` at the top of server components using translations or metadata.
- ALWAYS run `pnpm verify:quick` before push.

## Folder conventions

| Path                            | Folder                                | File                                | Edit?                             |
| ------------------------------- | ------------------------------------- | ----------------------------------- | --------------------------------- |
| `ui-primitives/<name>.tsx`      | flat kebab                            | flat kebab                          | NO (shadcn CLI)                   |
| `ui-effects/<name>.tsx`         | flat kebab                            | flat kebab                          | NO (upstream — treat as vendored) |
| `ui-effects/<Name>/`            | kebab                                 | PascalCase                          | YES (wrapper)                     |
| `ui-molecules/<domain>/<name>/` | kebab                                 | PascalCase                          | YES                               |
| `sections-<type>/<variant>/`    | kebab `<bucket>-<NN>`                 | PascalCase (no digits in file name) | YES                               |
| `layouts/_shared/<x>/`          | kebab (underscore prefix sorts first) | PascalCase                          | YES                               |

`index.ts` barrel re-aliases the bare component as `<Bucket><NN>Section` so consumers always import the unique name.

## File-size discipline

- Components < 200 lines. Split at the natural seam.
- Page templates < 150 lines.
- Config files exempt — as long as the data requires.

## Verification (CI runs all of these)

1. `pnpm tsc` — strict, no emit
2. `pnpm lint` — zero errors (warnings tolerated for /components placeholder anchors)
3. `pnpm format:check`
4. `pnpm verify:contrast` — WCAG AA on theme tokens
5. `pnpm build` — prerenders every static route × locale

Treat warnings as errors in /app + /lib + /config. A clean tree is a shippable tree.
