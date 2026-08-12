# Sanity infra — CLAUDE.md

Core, feature-agnostic Sanity wiring. The blog **content model** (schema / queries / types / desk) lives in `src/features/blog/sanity/` — see `src/features/blog/CLAUDE.md`.

## Modules

- `client.ts` — read client for RSC queries (`useCdn: false`).
- `live.ts` — `defineLive`. `<SanityLive />` is mounted in the layout **only when `features.blog`** (it revalidates public pages). `sanityFetchLive` switches to the `drafts` perspective under draft mode.
- `env.ts` / `token.ts` — `NEXT_PUBLIC_SANITY_*` (public) + `SANITY_API_READ_TOKEN` (server-only).
- `Studio.tsx` — `"use client"` wrapper around `<NextStudio>`. `image.ts` — `urlFor(source)`.
- `schema/` — **core, feature-independent SEO docs** (survive with the blog removed):
  `siteSettings` (one singleton — social, business entity, extra global schemas) +
  `siteMeta.<locale>` (per-locale — tagline / description / keywords / OG card /
  llms.txt / per-page `pageSeo`). `structure.ts` → the "SEO & métadonnées" desk
  section. `seo-queries.ts` → `siteSettingsQuery` / `siteSeoQuery`.
- SEO read path: `src/lib/seo/site-seo.ts` (`getSiteSeo` / `getSiteSettings`, React
  `cache()`) is the **sole** runtime source for the SEO surface — **no config
  fallback**. Editing guide → `docs/apps/web/seo/editing-seo-in-sanity.md`.
- **Navigation**: `schema/navigation.ts` (singleton `_id: navigation`) + reusable
  `schema/objects/{nav-item,locale-string}.ts` own the header menu + footer columns
  (one shared structure, per-language labels; header items can be dropdown groups
  with icon + description rich links). `nav-queries.ts` → `navigationQuery`; read
  path `src/lib/navigation.ts` (`getNavigation`, React `cache()`) is the **sole**
  runtime source — **no config fallback**, internal links flag-gated (disabled
  routes skipped). Desk: `navStructureItem` (`structure.ts`). Guide →
  `docs/apps/web/config/navigation.md`.
- **Field legends** (every `title` + `description` an editor reads) are written for
  non-technical editors — no jargon. Follow `.claude/rules/sanity-legends.md`.

## Rules

- **Never** instantiate a new `createClient` per route — fetch through `sanityFetchLive` (draft-mode aware) or `@/sanity/client`.
- **Never** expose `SANITY_API_READ_TOKEN` (or any non-public token) under a `NEXT_PUBLIC_` prefix.
- Draft mode: `/api/draft-mode/{enable,disable}` toggle the perspective — gated by `features.studio`, requires the read token.

## Wiring

Set `NEXT_PUBLIC_SANITY_PROJECT_ID` + `NEXT_PUBLIC_SANITY_DATASET` (`.env.example`). The CSP in `next.config.ts` already allows `https://*.sanity.io` + `wss://*.api.sanity.io`. Root `sanity.config.ts` registers `coreSchemaTypes` (`src/sanity/schema`) **+** `src/features/blog/sanity/schema`, and composes the core SEO desk (`seoStructureItem`) into the blog `structure`.
