# `@indiecrafts/web-surfaces-website` — app conventions

The web app (`code/projects/web/surfaces/website`) — live marketing site + the hub Sanity Studio. Auto-loads
under here; platform rules live in the root `CLAUDE.md`. This file = _how to build_; the token contract
`code/packages/web/ui-tokens/DESIGN.md` = _how it looks_ — **read it before creating or changing UI**
(reuse its tokens and parts, flag any `DESIGN.md` ↔ code conflict).

**Rules load with the files they govern.** Here (`.claude/rules/`): `naming` · `self-review` ·
`code-patterns` (❌/✅ for every NEVER below) always, `testing` on test files. Web-wide (root
`.claude/rules/web/`, shared with admin · app · packages · modules): `accessibility` · `adaptive-design` ·
`component-architecture` · `design-token-usage` · `figma-handoff` · `visual-verification` ·
`sanity-images` on `.tsx`/`.css`; `sanity-legends` on Sanity schema files; `sanity-data` (private ids,
the seed) on Sanity schemas, module writes and `scripts/`.

## Map

- `src/app/` — **routes only** (thin `page.tsx` / `route.ts`): `[locale]/<seg>`, `api/`, `studio/`, `maintenance/`.
  `routes.ts` aggregates the `pages` map → `ROUTES` + `PATHNAMES`.
- `src/config/` — app-owned config (`theme` · `fonts` · `features` · `consent` · `pages`); `index.ts` re-exports
  `@indiecrafts/packages-shared-config` primitives. Import both via `@/config`.
- `src/user-interface/` — app UI by page, then category (`account/` · `legal/` · `shared/` — incl. `layout/PageSidebar`).
  Primitives → `@indiecrafts/packages-web-ui`; status pages → `@indiecrafts/packages-web-system-pages`.
- `src/lib/` — app services (metadata · navigation · cookies · `seo/` · `islands`). `src/i18n/` — typed routing.
- `src/sanity/` — app queries + schema (own brief). The blog is `@indiecrafts/modules-web-blog` (own brief).
- `messages/<locale>.json` — chrome + `pages.<id>.*` UI copy (page-builder copy lives in Sanity).

Rationale + full tree → `code/docs/projects/web/website/config/project-organization.md`.

## How things connect

- **SEO copy is Sanity-only:** a page's title/description/keywords/`llms*` come from its rendering doc's
  `.seo`, resolved by `getPageSeo(page.id, locale)` (`@/lib/seo/site-seo`) — no messages fallback; a doc-less
  page gets the layout default. Page UI copy is `messages.<locale>.pages.<id>.*`. New locale → `locales` +
  `messages/<code>.json`.
- **Pages are page-builder documents:** the home and `[...slug]` render a `page`'s `sections[]` (generic + blog
  blocks, the blog's `MODULES_FRAGMENT` → its `Modules`; `siteBlocks` drops blog blocks with the blog off).
  Every page type wraps its content in `PageSidebar` (posts: `postSidebar`); the cards come from Studio → Barre
  latérale (`getSidebar`, `src/lib/sidebar.ts`; page types in `src/sanity/sidebar-pages.ts`). →
  `code/docs/packages/web/page-builder.md`.
- **Add a page:** `src/app/[locale]/<seg>/page.tsx` → an entry in the `pages` map (`src/config/pages.ts`;
  `StaticAppPathname` derives from it); for its own SEO, point `getPageSeo` at the Sanity doc with the `.seo`.
  Sitemap, routing, canonical/hreflang and `llms.txt` follow; a signed-in page sets `seo: { noindex: true }`.
- **Metadata** (`buildMetadata`, `@/lib/metadata`): structure from config (`site.*` → `seoDefaults.*` →
  `page.seo.*` robots/canonical) + copy from Sanity; it omits absent keys so the layout defaults survive.
  Per-page JSON-LD → `page.seo.structuredData[]` via `@/lib/seo/jsonld-factories` (FAQ first — the
  highest-ROI rich result). → `seo/seo-metadata.md`,
  `seo/structured-data-cookbook.md`, `seo/llms-endpoints.md` under `code/docs/projects/web/website/`.
- **Clerk loads only when needed** (`src/lib/clerk-load.ts`: a signed-in visitor, or `/sign-in` · `/sign-up`).
  Reach Clerk UI only through `@/user-interface/account/LazyClerk` (`next/dynamic`) from anything the layout or
  header renders — a static import puts Clerk back on every page. Client code checks `useClerkActive()`.
- **Flags:** `features.blog` (every blog route 404s and leaves sitemap, `llms.txt`, nav when off; gate in
  `@indiecrafts/modules-web-blog/lib/route-gate`) and `features.studio` (`/studio` + its Aperçu preview tab + draft mode + `frame-ancestors 'self'`) are independent.
- **Library sections:** a new section is a page-builder block (page-builder § Adding a block): copy, then
  adapt — editor copy → Sanity, chrome strings → `messages/`, colors/nav → `@/config`. Never add the
  component library as a dependency, workspace, or symlink. → `design/sections.md`.
- **Reuse before create:** existing part → backward-compatible variant → composed primitives → new shared part
  → page-specific. Authority: `@indiecrafts/packages-web-ui` + tokens → the library → screenshots.

## Critical rules (the NEVERs)

- NEVER commit `.env*` (only `.env.example`); never expose a non-public token (e.g. `SANITY_API_READ_TOKEN`) under `NEXT_PUBLIC_`.
- NEVER hard-code brand strings, URLs, colors, or nav — read from `@/config`.
- NEVER import `next/link` or `next-intl/navigation` — use `@/i18n/routing`.
- NEVER inline user-facing strings — every visible string lives in `messages/<locale>.json`.
- NEVER add `as any` — fix the type, or eslint-disable with a one-line reason.
- NEVER render a Sanity/remote image at full resolution — `next/image` (the loader sizes it at the CDN).
- NEVER hand-edit `@indiecrafts/packages-web-ui` primitives (shadcn CLI) or depend on the component library at runtime.
- NEVER swallow errors — `logger.error(...)` minimum.
- NEVER set state in `useEffect` to mark hydration — `useSyncExternalStore`.
- NEVER create a Sanity `createClient` per route — use the shared client.
- ALWAYS `setRequestLocale(locale)` at the top of server components that translate or build metadata.
- ALWAYS be adaptive-aware (reflow vs context-swap — name the mechanism) and use the `frontend-design` skill for UI direction.
- ALWAYS update the matching `code/docs/` page **and** the `code/docs/.vitepress/config.mts` sidebar in the same change.
- ALWAYS log behavior, config, route, convention, and design-token changes in this app's `CHANGELOG.md` with a plain-language _why_ (one area log, never copied).
- Components < 200 lines, page templates < 150 — split at the seam (config files exempt).

## Verification

The commit hook (`lint-staged` + `tsc`) and CI are the gate; lint cards + the `typescript-lsp` plugin give live
feedback (`code/docs/projects/web/website/setup/on-the-fly-checks.md`). CI runs `pnpm tsc` · `pnpm lint` ·
`pnpm format:check` · `pnpm verify:contrast` · `pnpm doctor:changed` · `pnpm build`. Run one by hand only to
reproduce a CI failure. Warnings are errors in `app/` · `lib/` · `config/`.
