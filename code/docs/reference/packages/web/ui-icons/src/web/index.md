---
title: "Web icon renderers"
description: "Barrel for the web (DOM) icon renderers, re-exporting the shared contract."
status: stable
---

# Web icon renderers

> The web entry point for the icon system.

## Purpose

The `./web` barrel of `@indiecrafts/packages-web-ui-icons`. It gathers the DOM renderers — `Icon` (via `lucide-react`), `BrandIcon`, `SvgIcon`, and `ReiconIcon` — and re-exports the shared contract for one-import ergonomics.

## Exports

- `Icon`, `GLYPH_COMPONENTS`, `IconProps` — the glyph renderer and its map.
- `BrandIcon`, `BrandIconProps` — the brand-mark renderer.
- `SvgIcon`, `SvgIconProps` — the custom-SVG renderer.
- `ReiconIcon`, `ReiconIconProps` — the reicon renderer (web only).
- `* from "../shared"` — the platform-agnostic contract (`GLYPHS`, `GlyphName`, `glyphOptions`, `SVGS`, `BRANDS`, and their helpers).

## Usage

```tsx
import {
  Icon,
  BrandIcon,
  ReiconIcon,
} from "@indiecrafts/packages-web-ui-icons/web";

<Icon name="rocket" className="size-5" />;
```

## Source

`code/packages/web/ui-icons/src/web/index.ts`
