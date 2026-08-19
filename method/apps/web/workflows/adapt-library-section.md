# Workflow — adapt a section from `../indiecrafts-library`

The library is **browse-only, copy-then-adapt** — never a runtime dependency.
Full rules → `CLAUDE.md` §"Working with the library" + `method/apps/web/rules/component-architecture.md`.

## Before copying — reuse ladder

Reuse an existing part → add a backward-compatible `cva` variant → compose
`@indiecrafts/ui` primitives → **then** adapt a library section. Don't duplicate
a part that already exists under a different name.

## Steps

1. **Browse** the variant in Storybook: `cd ../indiecrafts-library && pnpm storybook`.
2. **Copy** its file to `src/user-interface/<page>/sections/<Name>.tsx`. Flatten a
   multi-file folder (`schema.ts` + `config.ts` + `en.json`) into one `.tsx`, then
   **retarget to template conventions**:
   - strings → `messages/<locale>.json` (never inline)
   - colors / nav / brand → `@/config` + `globals.css` tokens (no raw hex/px)
   - links → `@/i18n/routing` (never `next/link`)
   - images → `next/image` with `sizes` (the CDN loader sizes them); replace any
     raw `<img>`/background-image on a remote URL — see `method/apps/web/rules/sanity-images.md`
   - icons → Lucide / Reicon (existing sets)
   - a foreign accent token (e.g. sensoria's `decor-warm`) → the template's
     semantic role (`brand`, or neutral `foreground`) — see `method/apps/web/rules/design-token-usage.md`
   - Target shape: `src/user-interface/homepage/sections/Features.tsx`.
3. **Copy the strings** into `messages/<locale>.pages.<id>.blocks.<simpleName>`
   (drop the library's `-NN` variant suffix: `features-01` → `features`).
4. **Mount** in the route's `page.tsx`, passing a `namespace`
   (`pages.home.blocks.<block>`) or `pageId` prop. Live pattern:
   `src/app/[locale]/(home)/page.tsx`.

## Finish

- New runtime dep introduced by the section? Install it, and check it doesn't
  duplicate an existing `ui/` primitive (e.g. embla already ships `ui/embla-carousel.tsx`).
- **State the mechanism** for the section: same content reflowing (responsive — the default) vs different content by context (adaptive swap, only where the content earns it). See `rules/adaptive-design.md`.
- `pnpm verify:quick`; verify at 375 / 768 / 1280 (the floor) + a touch device; log design-token changes in the app changelog `code/projects/web/surfaces/website/CHANGELOG.md`.
- When the library later improves the component, re-copy by hand + re-verify.
