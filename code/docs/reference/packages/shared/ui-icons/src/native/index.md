---
title: "Native icon renderers"
description: "Barrel for the React Native icon renderers, re-exporting the shared contract."
status: stable
---

# Native icon renderers

> The React Native entry point for the icon system.

## Purpose

The `./native` barrel of `@indiecrafts/packages-shared-ui-icons`. It gathers the React Native renderers — `Icon` (via `lucide-react-native`), `BrandIcon`, and `SvgIcon` (via `react-native-svg`) — and re-exports the shared contract. There is no `ReiconIcon` on native, because reicon has no React Native build.

## Exports

- `Icon`, `GLYPH_COMPONENTS`, `IconProps` — the glyph renderer and its map.
- `BrandIcon`, `BrandIconProps` — the brand-mark renderer.
- `SvgIcon`, `SvgIconProps` — the custom-SVG renderer.
- `* from "../shared"` — the platform-agnostic contract (`GLYPHS`, `GlyphName`, `glyphOptions`, `SVGS`, `BRANDS`, and their helpers).

## Usage

```tsx
import { Icon, BrandIcon } from "@indiecrafts/packages-shared-ui-icons/native";

<Icon name="rocket" size={18} />
<BrandIcon name="linkedin" />
```

## Source

`code/packages/shared/ui-icons/src/native/index.ts`
