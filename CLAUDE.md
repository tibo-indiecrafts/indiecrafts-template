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

pnpm gen:i18n           # regen block-messages, story-messages, MessageKey
pnpm gen:styles         # regen src/app/_component-styles.css
pnpm gen:routes         # regen routes.types.ts + pages registry
pnpm gen                # all three above
pnpm new:page <id>      # scaffold a page + route + messages

pnpm verify             # tsc + lint + format:check + contrast + pages + styles + i18n
pnpm verify:quick       # tsc + lint (the pre-push gate)
pnpm storybook          # visual review
```

Pre-push hook runs `lint && tsc`. Pre-commit runs `lint-staged`.

## The Config-First Principle

Component code NEVER hard-codes brand strings, URLs, colors, nav links, or SEO copy — read them from `@/config/*`. Adding content = config edit, not a component rewrite. Copying a component to change two strings? Push the strings into config or `messages/`.

## The layer spine

Every page renders top-down through this chain. Each layer takes typed inputs and ships defaults (`config.ts` + `en.json`).

```
ui-primitives/                  shadcn primitives (READ-ONLY, CLI-managed)
  ↳ ui-effects/                 decorative / animated effects — flat upstream files (READ-ONLY)
                                  + editable wrapper FOLDERS
       ↳ ui-molecules/<domain>/<name>/  shared molecule composites
            ↳ sections-<type>/<variant>/  content blocks: schema + config + en.json + .stories
                 ↳ pages-<name>/<variant>/  compositions: config (incl. SEO) + en.json + .stories
                      ↳ wrapped by layouts/<Name>Layout/  chrome (header/main/footer slots)
                           ↳ rendered by src/app/[locale]/<seg>/page.tsx  ROUTE FILE
```

Customize for a real project: edit `src/components/<bucket>/<variant>/` in place. No fork, no overlay. Delete folders you'll never use — codegen rebuilds.

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

Three message tiers merge at request time:

1. **Global** → `messages/<locale>.json` (root). Cross-cutting: `nav`, `cta`, `footer`, `common`, `typography`, `llms`.
2. **Per-route** → `src/app/[locale]/<seg>/messages/<locale>.json`. Merged under `pages.<id>.*`.
3. **Per-block / per-template** → `src/components/<bucket>/<variant>/en.json`. Aggregated by `src/i18n/block-messages.ts` under `blocks.<key>.*` (English only; non-English locales override at root tier 1).

**Rules**: never inline user-facing strings — pass `…Key` props that resolve via `useTranslations()`. Keep key trees identical across locales. Always `setRequestLocale(locale)` at the top of server components using translations or metadata. ALWAYS use `Link`/`useRouter`/`redirect`/`getPathname` from `@/i18n/routing` — never from `next/link` or `next-intl/navigation`. `MessageKey` is auto-derived from the merged English tree (typos are compile errors).

**Storybook isolation**: `Pages/*` and `Layouts/*` stories get the full message tree (they compose many blocks); everything else gets ONLY its own block's `en.json` so missing keys surface immediately. `pnpm gen:i18n` regenerates both maps and CI verifies drift.

## Theming + accessibility

- Tailwind v4 + CSS vars. Tokens in `src/config/theme.config.ts`, mirrored in `globals.css :root` as `oklch(...)`.
- Two dark triggers (precedence): `html[data-theme="dark"]` → `@media (prefers-color-scheme: dark)`. `@custom-variant dark` makes `dark:` utilities match on the attribute.
- `pnpm verify:contrast` parses globals.css, asserts WCAG AA across theme-token pairs. Run after any theme change.
- Satori gotcha: `next/og` doesn't understand `oklch()` — that's why `themeConfig.hexColors` exists alongside `themeConfig.colors`. Update both in the same commit when rebranding.
- `<html lang>` + `dir` from active locale. `SkipLink` mounted first in body, targets `#main`. Layouts MUST render exactly one `<main id="main" tabIndex={-1}>`. Every section: `<section aria-labelledby="…">` pointing at its heading. Prefer semantic HTML over ARIA. Icons `aria-hidden="true"` unless they're the sole label. Never `onClick` on `<div>`/`<span>` — use a button. Respect `prefers-reduced-motion`.

## SEO

- `buildMetadata({ page, templateSeo, locale, params? })` is the only way to set `<head>` tags. Builds canonical + hreflang map.
- `siteConfig.url` must be the production origin via `NEXT_PUBLIC_SITE_URL`. When unset, `siteConfig.url === PLACEHOLDER_SITE_URL` flips `isSiteConfigured` to false → `robots.ts` serves full disallow (keeps preview/staging out of search).
- `sitemap.ts` auto-generates one entry per (registered page × locale) with hreflang alternates. Dynamic `[slug]` routes skipped — append manually. Pages opt out via `seo.noindex` or `isPageVisible`.
- JSON-LD in `src/lib/seo/jsonld.tsx`. Root layout emits Organization + WebSite. Per-page schemas in `page.seo.structuredData[]`.

## Critical rules (the NEVERs)

- NEVER commit `.env*` (only `.env.example`).
- NEVER hard-code brand strings, URLs, colors, or nav entries — read from `@/config/*`.
- NEVER import from `next/link` or `next-intl/navigation` — use `@/i18n/routing`.
- NEVER add `as any` — fix the type. If genuinely impossible, eslint-disable with a one-line reason.
- NEVER swallow errors — at minimum `logger.error(...)` from `@/lib/logger`. No raw `console.*` in committed code.
- NEVER flatten a component into a bare file — folder + `index.ts` barrel.
- NEVER put page-specific strings in `messages/<locale>.json` (root) — they belong under `src/app/[locale]/<seg>/messages/`.
- NEVER edit `src/components/ui-primitives/**` (shadcn, CLI-managed) or the FLAT files at `src/components/ui-effects/*.tsx` (upstream). New shadcn drops land in `src/components/ui/` (staging) for review before promotion.
- NEVER set state inside `useEffect` to mark hydration — use `useSyncExternalStore`.
- ALWAYS `setRequestLocale` at the top of server components using translations or metadata.
- ALWAYS run `pnpm verify` before pushing.

## Adding things

- **shadcn primitive**: `pnpm dlx shadcn@latest add <name>` → lands in `src/components/ui/` (staging), review diff, `mv` to `ui-primitives/`. Always import from `@/components/ui-primitives/<name>`.
- **External registry block** (any shadcn-compatible registry wired in `components.json`): `pnpm dlx shadcn@latest add @<registry>/<name>`. If content → wrap into `sections-<type>/<variant>/` 5-file pattern. If decoration → `ui-effects/<slug>.tsx` flat OR `ui-effects/<Name>/` wrapper folder. **Translate every visible string before commit** — no "TODO: translate later" markers, no hardcoded English in committed registry components.
- **Section**: drop 5-file pattern (`<Name>.tsx`, `schema.ts`, `config.ts`, `en.json`, `<Name>.stories.tsx`, `index.ts`) into `sections-<type>/<variant>/`. Strings use `MessageKey` props that resolve via `useTranslations(<name>Namespace)`. Run `pnpm gen:i18n`.
- **Page template**: same 5-file pattern under `pages-<name>/<variant>/` PLUS `<name>Defaults.seo: PageSeo`. Route file in `src/app/[locale]/<seg>/` wires `buildMetadata({ templateSeo: ...Defaults.seo, page, locale })`.
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
7. `pnpm verify:i18n` — drift-guard on the i18n + story-isolation registries
8. `pnpm build` — prerenders every static route × locale

Treat warnings as errors. A clean tree is a shippable tree.

## Stack one-liner

Next.js 16 (App Router, Turbopack, React 19, React Compiler, `proxy.ts`) · TypeScript strict · Tailwind v4 (`@theme inline`, `@custom-variant dark` on `data-theme`) · next-intl v4 · next-themes · Zod · Storybook 10 · shadcn/ui (new-york, zinc).
