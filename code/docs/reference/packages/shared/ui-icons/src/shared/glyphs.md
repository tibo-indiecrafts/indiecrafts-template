---
title: "Glyph name set"
description: "The curated icon-name set shared by the web and native renderers and the Sanity pickers."
status: stable
---

# Glyph name set

> The single curated glyph-name set for renderers and pickers.

## Purpose

The one source for the curated UI and nav icon names. The names are lucide glyphs in kebab-case, which is both the picker value and the lucide id. Extend the list here and every renderer plus every Sanity picker follows, with no hand-sync. The original feature-grid names stay first for stored-content compatibility.

## Exports

- `GLYPHS` — the readonly array of curated glyph names.
- `GlyphName` — the union type derived from `GLYPHS`.
- `isGlyph` — type guard that narrows a string to `GlyphName`.
- `glyphOptions` — builds Sanity `options.list` entries from `GLYPHS`, or from a passed subset.

## Usage

```ts
import {
  glyphOptions,
  isGlyph,
} from "@indiecrafts/packages-shared-ui-icons/shared";

const options = glyphOptions(); // [{ title: "Zap", value: "zap" }, ...]
const ok = isGlyph("chevron-down"); // true
```

## Source

`code/packages/shared/ui-icons/src/shared/glyphs.ts`
