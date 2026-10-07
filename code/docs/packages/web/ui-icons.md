---
title: "@indiecrafts/packages-web-ui-icons — the icon system"
description: "One centralized icon brick."
status: stable
---

# `@indiecrafts/packages-web-ui-icons` — the icon system

One centralized icon brick. A shared **contract** (glyph names, custom-SVG registry, brand SVG data)
with DOM **renderers** — the same data→renderer split as [`ui-tokens`](/packages/web/ui-tokens).
Replaces the previous scattered, DOM-locked icon usage (lucide + reicon + inline SVGs across the app
and blog). **Three icon families:** lucide (base), custom SVGs, and brand/social marks. Reicon was
dropped: its by-name renderer had to import the whole set (about 2 MB gzipped) into every page.

|               |                                                                                                                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exports**   | `./shared` (contract — `GLYPHS` + `GlyphName` · `glyphOptions()` for Sanity pickers · `SVGS` custom-SVG registry + `SvgName` · `BRANDS` SVG-path data + `BrandName`) · `./web` (`Icon` lucide-react · `SvgIcon` custom · `BrandIcon`) |
| **Deps**      | `lucide-react`. **Peer:** `react`/`react-dom`                                                                                                                                                                                         |
| **Consumers** | `ui-components` `FeatureGrid` (`Icon`) · `page-builder` picker (`glyphOptions()`) · website nav (`Icon`), footer + blog share/author (`BrandIcon`)                                                                                    |

## Renderers

- **`/web` (DOM: React 19)** — `Icon` (lucide) · `SvgIcon` (custom) · `BrandIcon`.
  Serves the web surfaces (DOM).

## The single source

`./shared/glyphs.ts` `GLYPHS` is the one list of icon names. The web `Icon` maps from it, and
`glyphOptions()` builds the Sanity string-field `options.list` from it — so a new glyph appears in
the web `Icon` **and** the Studio picker with no hand-sync. Add a name to `GLYPHS`
(and, if lucide's PascalCase id isn't already mapped, to `GLYPH_COMPONENTS`).

Brand/social marks live in `./shared/brands.ts` as 24×24 single-path SVG data (`BRANDS`), so the web
`<svg>` renderer draws one source — no more duplicate brand-icon files.
**`brands.ts` is GENERATED** from `brands.json` (our name → a `simple-icons` slug, or an inline
`{ title, hex, path }` for a mark simple-icons lacks — e.g. LinkedIn): edit `brands.json`, run
`pnpm brands:build`; `pnpm brands:check` guards drift in CI (like `tokens:check`). `simple-icons` is a
build-only devDependency, so the runtime file stays dependency-free. Never hand-edit `brands.ts`.

## Gotchas

- **`./web` re-exports `./shared`** for one-import ergonomics.
- **No Tailwind classes of its own** — the renderers take `className`/size props from the caller, so no
  `@source` line is needed in `ui-tokens/globals.css`.
- **`FeatureIcon` = `GlyphName`.** `ui-components`' block contract re-exports `GlyphName` as
  `FeatureIcon`, so stored feature-grid content stays valid while the offered set widens.
