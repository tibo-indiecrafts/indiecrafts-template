---
title: "@indiecrafts/packages-web-ui-icons — the icon system"
description: "One centralized icon brick."
status: stable
---

# `@indiecrafts/packages-web-ui-icons` — the icon system

One centralized icon brick. A shared **contract** (glyph names, custom-SVG registry, brand SVG data)
with platform-forked **renderers** — the same data→renderer split as [`ui-tokens`](/packages/shared/ui-tokens).
Replaces the previous scattered, DOM-locked icon usage (lucide + reicon + inline SVGs across the app
and blog). **Four icon families:** lucide (cross-platform base), reicon (web), custom SVGs
(cross-platform), and brand/social marks (cross-platform).

|               |                                                                                                                                                                                                                                                                                                                                                                            |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exports**   | `./shared` (contract — `GLYPHS` + `GlyphName` · `glyphOptions()` for Sanity pickers · `SVGS` custom-SVG registry + `SvgName` · `BRANDS` SVG-path data + `BrandName`) · `./web` (`Icon` lucide-react · `ReiconIcon` reicon-react · `SvgIcon` custom · `BrandIcon`) · `./native` (`Icon` lucide-react-native · `SvgIcon`/`BrandIcon` react-native-svg — **no `ReiconIcon`**) |
| **Deps**      | `lucide-react`, `reicon-react`. **Peer (optional):** `lucide-react-native`, `react-native-svg` (native only), `react`/`react-dom`                                                                                                                                                                                                                                          |
| **Consumers** | `ui-components` `FeatureGrid` (`Icon`) · `page-builder` picker (`glyphOptions()`) · website nav (`ReiconIcon`), footer + blog share/author (`BrandIcon`), homepage showcase; a mobile app imports `./native`                                                                                                                                                               |

## Platform coverage (by rendering surface)

- **`/web` (DOM: React 19)** — `Icon` (lucide) · `ReiconIcon` (reicon) · `SvgIcon` (custom) · `BrandIcon`.
  Serves the web surfaces (DOM), so reicon works there.
- **`/native` (React Native)** — `Icon` (lucide-react-native) · `SvgIcon`/`BrandIcon` (react-native-svg).
  **No `ReiconIcon`** — reicon has no RN build; use lucide + custom SVGs on native.

## The single source

`./shared/glyphs.ts` `GLYPHS` is the one list of icon names. Both renderers map from it, and
`glyphOptions()` builds the Sanity string-field `options.list` from it — so a new glyph appears in
the web `Icon`, the native `Icon`, **and** the Studio picker with no hand-sync. Add a name to `GLYPHS`
(and, if lucide's PascalCase id isn't already mapped, to each renderer's `GLYPH_COMPONENTS`).

Brand/social marks live in `./shared/brands.ts` as 24×24 single-path SVG data (`BRANDS`), so the web
`<svg>` and native `react-native-svg` renderers draw one source — no more duplicate brand-icon files.
**`brands.ts` is GENERATED** from `brands.json` (our name → a `simple-icons` slug, or an inline
`{ title, hex, path }` for a mark simple-icons lacks — e.g. LinkedIn): edit `brands.json`, run
`pnpm brands:build`; `pnpm brands:check` guards drift in CI (like `tokens:check`). `simple-icons` is a
build-only devDependency, so the runtime file stays dependency-free. Never hand-edit `brands.ts`.

## Adopting on native

A mobile (Expo) app: `npx expo install lucide-react-native react-native-svg` (Expo pins the RN-svg
version), then `import { Icon, BrandIcon } from "@indiecrafts/packages-web-ui-icons/native"`. The
`./native` renderers are typechecked only when a consumer imports them, so a web-only install never
needs the RN peers.

## Gotchas

- **Web vs native subpath.** Import `./web` on Next/DOM, `./native` on React Native; both re-export the
  `./shared` contract for one-import ergonomics. A web app bundles only `lucide-react`.
- **No Tailwind classes of its own** — the renderers take `className`/size props from the caller, so no
  `@source` line is needed in `ui-tokens/globals.css`.
- **`FeatureIcon` = `GlyphName`.** `ui-components`' block contract re-exports `GlyphName` as
  `FeatureIcon`, so stored feature-grid content stays valid while the offered set widens.
