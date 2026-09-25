---
title: "Icon contract"
description: "Barrel for the platform-agnostic icon contract: glyph names, custom-SVG registry, and brand data."
status: stable
---

# Icon contract

> The platform-agnostic entry point for the icon system.

## Purpose

The `./shared` barrel of `@indiecrafts/packages-shared-ui-icons`. It re-exports the icon contract — the curated glyph name set, the custom-SVG registry, and the brand-mark data. The module is pure data with no renderer, so the web and native renderers draw from one source. It is safe to import from any platform.

## Exports

- `* from "./glyphs"` — `GLYPHS`, `GlyphName`, `isGlyph`, `glyphOptions`.
- `* from "./brands"` — `BRANDS`, `BrandName`, `BrandMark`, `BRAND_NAMES`, `isBrand`.
- `* from "./svgs"` — `SVGS`, `SvgName`, `SvgMark`, `isSvg`.

## Usage

```ts
import {
  GLYPHS,
  BRANDS,
  SVGS,
} from "@indiecrafts/packages-shared-ui-icons/shared";
```

## Source

`code/packages/shared/ui-icons/src/shared/index.ts`
