---
title: "Glyph icon (web)"
description: "Web renderer that maps a curated glyph name to its lucide-react component."
status: stable
---

# Glyph icon (web)

> Draws a curated glyph by name on the web.

## Purpose

The single web glyph renderer. It maps a `GlyphName` to a `lucide-react` component through the `GLYPH_COMPONENTS` map, and falls back to `sparkles` for an unknown name. It is purely presentational and takes `className` and size from the caller.

## Exports

- `IconProps` — type: lucide component props plus a `name` of `GlyphName` and an optional `fallback`.
- `Icon` — component that renders the named glyph.
- `GLYPH_COMPONENTS` — the `GlyphName` to `lucide-react` component map.

## Usage

```tsx
import { Icon } from "@indiecrafts/packages-web-ui-icons/web";

<Icon name="shield" className="size-5 text-brand" />;
```

## Source

`code/packages/web/ui-icons/src/web/Icon.tsx`
