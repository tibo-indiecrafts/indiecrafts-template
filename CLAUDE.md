# indiecrafts.dev — CLAUDE.md

Config-first, modular Next.js 16 template for client sites. Edit `src/config/*` + drop blocks into `src/components/sections-<type>/`, ship.

## Working principles

1. Don't assume. Don't hide confusion. Surface tradeoffs.
2. Minimum code that solves the problem. Nothing speculative.
3. Touch only what you must. Clean up only your own mess.
4. Define success criteria. Loop until verified.
5. Simplify code wherever you can.

## Quick reference

```bash
pnpm dev                # dev server (Turbopack). Runs gen:styles first.
pnpm build              # production build
pnpm tsc                # type check (strict, no emit)
pnpm lint               # ESLint — ~25 jsx-a11y rules enumerated as errors, ZERO warnings tolerated
pnpm format             # Prettier write
pnpm test               # Vitest (happy-dom, 80% coverage target)

pnpm gen:styles         # regen src/app/_component-styles.css
pnpm gen:routes         # regen routes.types.ts + pages registry
pnpm gen                # both of the above
pnpm new:page <id>      # scaffold a page + route + messages

pnpm verify             # tsc + lint + format:check + contrast + pages + styles + routes
pnpm verify:quick       # tsc + lint (the pre-push gate)
pnpm storybook          # visual review
```

Pre-push hook runs `lint && tsc`. Pre-commit runs `lint-staged`.

## The Config-First Principle

Component code NEVER hard-codes brand strings, URLs, colors, nav links, or SEO copy — read them from `@/config/*`. Adding content = config edit, not a component rewrite. Copying a component to change two strings? Push the strings into config or `messages/`.

## The layer spine

Production routes live in `src/app/[locale]/<seg>/` and own their config + composition. `/components` is the examples library — you copy a section into a route and wire it up.

```
src/components/                  EXAMPLES (Storybook fodder)
  ui-primitives/                 shadcn primitives (READ-ONLY)
   ↳ ui-effects/                 decorative effects — flat upstream files (READ-ONLY)
       ↳ ui-molecules/<…>/       shared molecule composites
       ↳ sections-<type>/<var>/  content block examples (5-file pattern)
       ↳ pages-<name>/<var>/     full-page composition examples
       ↳ layouts/<Name>Layout/   layout EXAMPLES (default/dashboard/prose/sidebar/full-bleed)

src/app/_chrome/                 PRODUCTION chrome — FORKED from /components/layouts/
  DefaultLayout.tsx              ↑ /app does NOT import from /components/layouts
  Header.tsx                     atoms (Logo, LocaleSwitcher, ThemeToggle) still shared
  Footer.tsx
  SkipLink.tsx

src/app/[locale]/<seg>/          ONE ROUTE = ONE FOLDER
  page.config.ts                 pure data: key, slug, id, SEO (imported by routing.ts + sitemap.ts)
  page.tsx                       React composition + generateMetadata
```

The chrome split is required by Next.js's server/client boundary: routing.ts is server-only and importing `page.tsx` (which transitively touches client components) would mis-mark the page as client. Keeping the pure-data `page.config.ts` separate lets routing.ts read the slug without dragging in client code.

Customize for a real project: copy a section from `/components/sections-*/` into `src/app/[locale]/<seg>/page.tsx`, pass production `*Key` props, bake the strings into `messages/<locale>.json` under `pages.<id>.blocks.<simpleName>`. No registry, no codegen — see README → "Migrating a section from /components into the app".

## Folder & naming conventions

| Where                                                           | Folder                                     | File       | Edit?                                   |
| --------------------------------------------------------------- | ------------------------------------------ | ---------- | --------------------------------------- |
| `ui-primitives/<name>.tsx`                                      | flat kebab                                 | flat kebab | NO (shadcn CLI)                         |
| `ui-effects/<name>.tsx`                                         | flat kebab                                 | flat kebab | NO (upstream effect, treat as vendored) |
| `ui-effects/<Name>/`                                            | kebab folder                               | PascalCase | YES (wrapper)                           |
| `ui-molecules/<domain>/<name>/` or `<domain>/<name>/<variant>/` | kebab                                      | PascalCase | YES                                     |
| `layouts/_shared/<x>/`                                          | kebab (intentional `_` prefix sorts first) | PascalCase | YES                                     |
| `layouts/<Name>Layout/`                                         | PascalCase folder                          | PascalCase | YES                                     |
| `sections-<type>/<variant>/`                                    | kebab `<bucket>-<NN>` or descriptive kebab | PascalCase | YES                                     |
| `pages-<name>/<variant>/`                                       | kebab `<bucket>-<NN>`                      | PascalCase | YES                                     |

**File-name rule for variant folders**: `<bucket>-<NN>/<Bucket>.tsx` (no digits in the file name). The `index.ts` barrel re-aliases the bare component as `<Bucket><NN>Section` / `<Bucket><NN>` so consumers always import the unique name. Block KEY/NAMESPACE/SAMPLE constants in `config.ts` keep the `<bucket><NN>` prefix (stable public API).

Multi-variant molecules: parent folder has no `.tsx`; each variant is a leaf folder with disambiguating file name. Single → flat. When a second variant appears, promote.

## i18n workflow

**Single flat tree** — `messages/<locale>.json` is the only file the app loads at runtime. No merge, no codegen.

Structure:

```jsonc
{
  // Cross-cutting chrome
  "nav": { … }, "cta": { … }, "footer": { … }, "common": { … },
  "typography": { … }, "validation": { … }, "llms": { … },

  // One key per route — page-level copy + nested blocks
  "pages": {
    "home": {
      "title": "…", "description": "…",
      "blocks": {
        "features": { … },     // copy for the Features section mounted on /
        "cta":      { … },
        "pricing":  { … }
      }
    },
    "about": {
      "blocks": {
        "features": { … }      // the same block on /about gets its own copy
      }
    }
  }
}
```

**Rules**:

- Never inline user-facing strings — pass `…Key` props that resolve via `useTranslations()` or `tr(...)`.
- Block keys live under `pages.<routeId>.blocks.<simpleName>` (drop the `-NN` variant suffix that appears in `/components/<bucket>/<name>-NN/` — that suffix is only meaningful in the examples library).
- The same block on multiple pages = duplicate copy under each page (cheap, keeps each route independent).
- Keep key trees identical across locales. Always `setRequestLocale(locale)` at the top of server components using translations or metadata. ALWAYS use `Link`/`useRouter`/`redirect`/`getPathname` from `@/i18n/routing` — never from `next/link` or `next-intl/navigation`.

**`/components` is an examples library.** Each block ships its own `en.json` referencing `blocks.<name>-NN.*` — that namespace only exists inside Storybook. Production routes wire blocks via explicit `*Key` props pointing into `pages.<routeId>.blocks.*` (see README → "Migrating a section from /components into the app").

**Storybook**: `.storybook/preview.tsx` builds a synthetic `blocks.<variant>` map from `import.meta.glob("../src/components/**/en.json")` at preview-load time. No codegen, no drift checks — new `en.json` files appear in stories on next Vite restart.

## Theming + accessibility

- Tailwind v4 + CSS vars. Tokens in `src/config/theme.config.ts`, mirrored in `globals.css :root` as `oklch(...)`.
- Two dark triggers (precedence): `html[data-theme="dark"]` → `@media (prefers-color-scheme: dark)`. `@custom-variant dark` makes `dark:` utilities match on the attribute.
- `pnpm verify:contrast` parses globals.css, asserts WCAG AA across theme-token pairs. Run after any theme change.
- Satori gotcha: `next/og` doesn't understand `oklch()` — that's why `themeConfig.hexColors` exists alongside `themeConfig.colors`. Update both in the same commit when rebranding.
- `<html lang>` + `dir` from active locale. `SkipLink` mounted first in body, targets `#main`. Layouts MUST render exactly one `<main id="main" tabIndex={-1}>`. Every section: `<section aria-labelledby="…">` pointing at its heading. Prefer semantic HTML over ARIA. Icons `aria-hidden="true"` unless they're the sole label. Never `onClick` on `<div>`/`<span>` — use a button. Respect `prefers-reduced-motion`.

## SEO + LLMs

**Single source of truth: `messages.<locale>.pages.<id>.title` / `.description`.** SEO, JSON-LD, sitemap, llms.txt, llms-full.txt all read from the same i18n keys per page. No parallel SEO config.

### Inheritance chain (lowest → highest precedence)

1. `site.*` (config) → name, url, logo, social
2. `seoDefaults.*` (config) → titleTemplate, robots, OG type/siteName, twitter card, verification
3. Auto-derived per `page.id` → titleKey=`pages.<id>.title`, descriptionKey=`pages.<id>.description`, og:image=`/brand/og-<id>.png`, canonical=`${site.url}${slug-for-locale}`
4. `page.seo.*` (config) → explicit per-page overrides

`buildMetadata({ page, locale })` (`@/lib/metadata`) composes the chain. Layout-level metadata is emitted via `generateMetadata({ params })` so the layout-level OG description localizes too (Next.js metadata replaces — not deep-merges — the `openGraph`/`twitter` objects, so the page-level builder re-emits `siteName`/`type`/`card` to keep them).

### Per-locale (verified)

Per-locale: `<title>`, `<meta description>`, canonical, hreflang, og:_ / twitter:_ (title/desc/url/locale/locale:alternate/image:alt), JSON-LD WebPage (name/desc/url/inLanguage), JSON-LD Organization.description, JSON-LD WebSite.description, /llms.txt, /llms-full.txt, /llms/<id>, sitemap hreflang.

Constant across locales (intentional): site name, Organization.address/foundingDate, og:image URL (one card per page), `og:type=website`, `twitter:card`.

### Adding a page — what propagates automatically

- Drop entry in `pages` map (config/index.ts) with key/id/slug + optional `seo.keywords`/`structuredData`
- Add `pages.<id>.title` + `pages.<id>.description` in every `messages/<locale>.json`
- Add key to `AppPathname` (routes.types.ts)

Auto-propagates: sitemap entry × locales, hreflang, canonical, OG/Twitter meta, JSON-LD WebPage, /llms.txt entry, /llms-full.txt section, /llms/<id> endpoint. **Never need to register a page in more than one place.**

### JSON-LD

`src/lib/seo/jsonld.tsx` exposes factories for: Organization, WebSite (+ optional SearchAction for sitelinks search), WebPage (auto), BreadcrumbList, Article, FAQPage, Service, Product, LocalBusiness, Person. **FAQ is the highest-ROI rich result for B2B** (shows expandable Q&A in search results) — wire via `page.seo.structuredData: [buildFAQPageSchema([...])]`. The root layout emits Organization + WebSite + `globalSchemas` (custom site-wide). Per-page emits via `<PageSchemas page={pages.X} locale={locale} />` in each `page.tsx`.

### LLM endpoints

- `/llms.txt` + `/<locale>/llms.txt` — per [llmstxt.org](https://llmstxt.org) spec, auto-built page list
- `/llms-full.txt` + `/<locale>/llms-full.txt` — all pages' content concatenated (Mintlify / Anthropic convention)
- `/llms/<id>` + `/<locale>/llms/<id>` — per-page Markdown for direct LLM ingestion

All three iterate `ROUTES` (= the `pages` map) and read the same i18n keys SEO uses. `proxy.ts` matcher passes these paths to next-intl so locale rewrites work.

### Critical rules

- `NEXT_PUBLIC_SITE_URL` MUST be set in production (otherwise `robots.ts` serves `Disallow: /`).
- Never inline SEO copy in code — always via `messages.<locale>.pages.<id>.*` or `site.*` config.
- Sitemap reads `ROUTES` (= `pages` map). Dynamic `[slug]` routes skipped — expand per project.
- After adding a page, fetch `/` AND `/fr/` (etc.) and `grep -E '<meta|<title>|application/ld'` to confirm the SEO output differs per locale.

## Critical rules (the NEVERs)

- NEVER commit `.env*` (only `.env.example`).
- NEVER hard-code brand strings, URLs, colors, or nav entries — read from `@/config/*`.
- NEVER import from `next/link` or `next-intl/navigation` — use `@/i18n/routing`.
- NEVER add `as any` — fix the type. If genuinely impossible, eslint-disable with a one-line reason.
- NEVER swallow errors — at minimum `logger.error(...)` from `@/lib/logger`. No raw `console.*` in committed code.
- NEVER flatten a component into a bare file — folder + `index.ts` barrel.
- NEVER inline user-facing strings — every visible string lives in `messages/<locale>.json` under either chrome keys or `pages.<routeId>.*`.
- NEVER edit `src/components/ui-primitives/**` (shadcn, CLI-managed) or the FLAT files at `src/components/ui-effects/*.tsx` (upstream). New shadcn drops land in `src/components/ui/` (staging) for review before promotion.
- NEVER set state inside `useEffect` to mark hydration — use `useSyncExternalStore`.
- ALWAYS `setRequestLocale` at the top of server components using translations or metadata.
- ALWAYS run `pnpm verify` before pushing.

## Adding things

- **shadcn primitive**: `pnpm dlx shadcn@latest add <name>` → lands in `src/components/ui/` (staging), review diff, `mv` to `ui-primitives/`. Always import from `@/components/ui-primitives/<name>`.
- **External registry block** (any shadcn-compatible registry wired in `components.json`): `pnpm dlx shadcn@latest add @<registry>/<name>`. If content → wrap into `sections-<type>/<variant>/` 5-file pattern. If decoration → `ui-effects/<slug>.tsx` flat OR `ui-effects/<Name>/` wrapper folder. **Translate every visible string before commit** — no "TODO: translate later" markers, no hardcoded English in committed registry components.
- **Section** (in /components): drop 5-file pattern (`<Name>.tsx`, `schema.ts`, `config.ts`, `en.json`, `<Name>.stories.tsx`, `index.ts`) into `sections-<type>/<variant>/`. The block's sample in `config.ts` references its own `blocks.<name>-NN.*` namespace — that's the Storybook-only namespace. **Production use is a separate step** — see README → "Migrating a section from /components into the app".
- **Page template** (in /components): same 5-file pattern under `pages-<name>/<variant>/` PLUS `<name>Defaults.seo: PageSeo`. Optional — production routes can compose sections directly in `src/app/[locale]/<seg>/page.tsx` instead of going through a page-template wrapper.
- **UI effect / molecule**: drop into `ui-effects/<name>/` or `ui-molecules/<domain>/<name>/`. Co-locate any CSS animation tokens in `<name>.css` next to the `.tsx` — `pnpm gen:styles` aggregates them into `_component-styles.css`.

## File-size discipline

- Components < 200 lines. Split at the natural seam.
- Page-templates < 150 lines. New section type instead of inlining variation.
- Config files exempt — as long as the data requires.

## Verification (CI runs all of these)

1. `pnpm tsc` — strict, no emit
2. `pnpm lint` — zero warnings
3. `pnpm format:check`
4. `pnpm verify:contrast`
5. `pnpm verify:pages`
6. `pnpm verify:styles` — drift-guard on `_component-styles.css`
7. `pnpm verify:routes` — drift-guard on the page registry + routes.types.ts
8. `pnpm build` — prerenders every static route × locale

Treat warnings as errors. A clean tree is a shippable tree.

## Stack one-liner

Next.js 16 (App Router, Turbopack, React 19, React Compiler, `proxy.ts`) · TypeScript strict · Tailwind v4 (`@theme inline`, `@custom-variant dark` on `data-theme`) · next-intl v4 · next-themes · Zod · Storybook 10 · shadcn/ui (new-york, zinc).
