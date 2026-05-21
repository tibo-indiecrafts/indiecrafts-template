# indiecrafts.dev

Config-first, modular Next.js 16 template for client sites. Edit `src/config/*`, drop blocks into `src/components/sections-<type>/`, ship.

**Stack**: Next.js 16 · React 19 · TypeScript strict · Tailwind v4 · next-intl v4 · next-themes · Zod · Storybook 10 · shadcn/ui.

Conventions, naming rules, and the layer spine live in [`CLAUDE.md`](./CLAUDE.md) — read that before making non-trivial changes.

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm verify       # full CI gate (tsc + lint + format + contrast + pages + styles + i18n)
```

## Commands

```bash
pnpm dev / build / tsc / lint / format / test    # standard
pnpm gen                                          # regen styles + i18n + routes
pnpm gen:i18n / gen:styles / gen:routes           # individual codegens
pnpm new:page <id>                                # scaffold route + messages
pnpm storybook                                    # visual review
pnpm verify / verify:quick                        # CI gate / tsc + lint only
```

## Customizing

1. Edit `src/config/*` first — site metadata, theme tokens, navigation, routes, feature flags.
2. Edit `messages/<locale>.json` to override any block string.
3. Edit sections/templates in place under `src/components/` — no fork, no overlay. Delete folders you'll never use; codegen rebuilds without them.

## SEO

- Set `NEXT_PUBLIC_SITE_URL` in production. When unset, `robots.ts` serves `disallow: /` so preview/staging stay out of search engines.
- `sitemap.ts` auto-generates `(page × locale)` entries with hreflang. Dynamic `[slug]` routes are skipped — append manually.
- Per-page SEO: declare on `page.config.ts` under `seo:` (merges over template defaults). `seo: { noindex: true }` opts out (sitemap respects).

## Project structure

```
src/
├── app/[locale]/           Next App Router (locale-scoped)
├── config/                 SINGLE SOURCE OF TRUTH (edit here first)
├── components/
│   ├── ui-primitives/      shadcn primitives (read-only)
│   ├── ui-effects/         decorative / animated effects (flat upstream files + editable wrappers)
│   ├── ui-illustrations/   decorative React components
│   ├── ui-molecules/       shared molecule composites
│   ├── layouts/            page templates + chrome
│   ├── sections-*/         content blocks (one folder per type)
│   └── pages-*/            ready-made page compositions
├── i18n/                   routing, request handler, message aggregator
├── lib/                    metadata, logger, typography, seo/jsonld
└── proxy.ts                Next 16 locale routing
```
