# Sanity infra (app) — core, feature-agnostic wiring

Auto-loads under `code/projects/web/surfaces/website/src/sanity/**`. Core, feature-agnostic Sanity wiring for the web app. The blog **content model** (schema / queries / types / desk) lives in the blog module `code/modules/web/blog/` (`@indiecrafts/blog`) — see `code/modules/web/blog/.claude/CLAUDE.md`.

**Stack:** Sanity v5 (Studio · GROQ · structure) · next-sanity · TypeScript. The CMS infrastructure layer.

## Modules

- `client.ts` — read client for RSC queries (`useCdn: false`).
- `live.ts` — `defineLive`. `<SanityLive />` is mounted in the layout **only when `features.blog`** (it revalidates public pages). `sanityFetchLive` switches to the `drafts` perspective under draft mode.
- `env.ts` / `token.ts` — `NEXT_PUBLIC_SANITY_*` (public) + `SANITY_API_READ_TOKEN` (server-only).
- `Studio.tsx` — `"use client"` wrapper around `<NextStudio>`. `image.ts` — `urlFor(source)`.
- `schema/` — **core, feature-independent SEO docs** (survive with the blog removed):
  `siteSettings` (one singleton — social, business entity, extra global schemas) +
  `siteMeta.<locale>` (per-locale **site-wide defaults** — tagline / description /
  keywords / default OG card / llms.txt). `structure.ts` → the "SEO & métadonnées"
  desk section. `seo-queries.ts` → `siteSettingsQuery` / `siteSeoQuery` + the per-doc
  `seoMeta` queries (`homeSeoQuery` / `blogSeoQuery` / `legalSeoQuery` / `waitlistSeoQuery`).
- **Per-page SEO** is NOT a central array — each doc a route renders carries its own
  `.seo` (the shared `seoMeta`, `@indiecrafts/schema`). `getPageSeo(pageId, locale)`
  (`src/lib/seo/site-seo.ts`) dispatches each static route to its owning doc's `.seo`.
- SEO read path: `src/lib/seo/site-seo.ts` (`getSiteSeo` / `getSiteSettings` /
  `getPageSeo`, React `cache()`) is the **sole** runtime source for the SEO surface —
  **no config fallback**. Editing guide → `code/docs/apps/web/seo/editing-seo-in-sanity.md`.
- **Navigation**: `schema/navigation.ts` (singleton `_id: navigation`) + reusable
  `schema/objects/{nav-item,locale-string}.ts` own the header menu + footer columns
  (one shared structure, per-language labels; header items can be dropdown groups
  with icon + description rich links). `nav-queries.ts` → `navigationQuery`; read
  path `src/lib/navigation.ts` (`getNavigation`, React `cache()`) is the **sole**
  runtime source — **no config fallback**, internal links flag-gated (disabled
  routes skipped). Desk: `navStructureItem` (`structure.ts`). Guide →
  `code/docs/apps/web/config/navigation.md`.
- **Field legends** (every `title` + `description` an editor reads) are written for
  non-technical editors — no jargon. Follow `.claude/rules/sanity-legends.md`.

## Rules

- **Never** instantiate a new `createClient` per route — fetch through `sanityFetchLive` (draft-mode aware) or `@/sanity/client`.
- **Never** expose `SANITY_API_READ_TOKEN` (or any non-public token) under a `NEXT_PUBLIC_` prefix.
- Draft mode: `/api/draft-mode/{enable,disable}` toggle the perspective — gated by `features.studio`, requires the read token.

## Wiring

Set `NEXT_PUBLIC_SANITY_PROJECT_ID` + `NEXT_PUBLIC_SANITY_DATASET` (`.env.example`). The CSP in `next.config.ts` already allows `https://*.sanity.io` + `wss://*.api.sanity.io`. Root `sanity.config.ts` composes the Studio from `SanityModule` barrels via `composeStudio([...])` — the app-core (`coreSanity` from `src/sanity`, which contributes the core SEO desk `seoStructureItem`) + each module's barrel (`@indiecrafts/page-builder/sanity` — the `page` model incl. the home, `@indiecrafts/blog/sanity`, newsletter, waitlist, …) + shared/email. See `@indiecrafts/sanity/module` + `code/docs/packages/sanity.md`.
