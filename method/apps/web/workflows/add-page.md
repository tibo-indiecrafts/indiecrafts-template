# Workflow — add a page (route)

Four edits; everything else propagates (sitemap, routing, llms.txt × locales, SEO
metadata, JSON-LD WebPage). Full rules → `CLAUDE.md` §"Adding a page".

1. **Route** — `src/app/[locale]/<seg>/page.tsx` (thin: `page.tsx` only). Call
   `setRequestLocale(locale)` first in any server component using translations or
   metadata.
2. **Config entry** — add to the `pages` map in `src/config/pages.ts`:
   `{ key, id, slug, seo: { keywords } }`. `slug` may be a plain string or a
   `{ [locale]: string }` object for per-locale paths. The `StaticAppPathname`
   union is **derived from the map**, so the typed route follows automatically —
   no separate key list to edit.
3. **Copy** — `pages.<id>.title` + `pages.<id>.description` in **every**
   `messages/<locale>.json` (both en + fr).

## Finish

- SEO metadata comes free via `buildMetadata({ page, locale })` — no per-page
  wiring. Per-page JSON-LD extras → `page.seo.structuredData[]` (factories in
  `@/lib/seo/jsonld-factories`).
- Compose the page body from sections — see `adapt-library-section.md`. Any image →
  `next/image` with `sizes` (CDN loader sizes it); never a raw full-res `<img>`
  (`method/apps/web/rules/sanity-images.md`).
- `pnpm verify:quick`, then **`pnpm doctor:changed`** — React Doctor flags new React security/perf/correctness/architecture issues vs `main` and blocks on a new error (advisory-only in CI, so run it here). `pnpm build` if routing/config changed (prerender check).
- Verify at 375 / 768 / 1280 (the floor) + a touch device; state each section's mechanism (reflow vs context-swap) — see `rules/adaptive-design.md`.
