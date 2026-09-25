---
title: "Glyph icon (native)"
description: "React Native renderer that maps a curated glyph name to its lucide-react-native component."
status: stable
---

# Glyph icon (native)

> Draws a curated glyph by name on React Native.

## Purpose

The React Native glyph renderer. It maps a `GlyphName` to a `lucide-react-native` component through the `GLYPH_COMPONENTS` map, and falls back to `sparkles` for an unknown name. It mirrors the web `Icon` so both platforms share the glyph set.

## Exports

- `IconProps` — type: lucide component props plus a `name` of `GlyphName` and an optional `fallback`.
- `Icon` — component that renders the named glyph.
- `GLYPH_COMPONENTS` — the `GlyphName` to `lucide-react-native` component map.

## Usage

```tsx
import { Icon } from "@indiecrafts/packages-shared-ui-icons/native";

<Icon name="shield" size={20} color="#296cd8" />;
```

## Source

`code/packages/shared/ui-icons/src/native/Icon.tsx`
