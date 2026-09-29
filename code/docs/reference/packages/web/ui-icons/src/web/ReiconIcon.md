---
title: "Reicon icon (web)"
description: "Web-only renderer that resolves a reicon-react glyph by name and renders null on an unknown name."
status: stable
---

# Reicon icon (web)

> Draws a reicon glyph by name on the web.

## Purpose

A web-only client renderer for the `reicon-react` icon set, which has no React Native build. It resolves the named glyph from the reicon named exports, uses an optional `fallback`, and returns null for an unknown name.

## Exports

- `ReiconIconProps` — type: `name`, an optional `fallback`, `size`, `weight` (`"Outline"` or `"Filled"`), and `className`.
- `ReiconIcon` — component that renders the named reicon glyph.

## Usage

```tsx
import { ReiconIcon } from "@indiecrafts/packages-web-ui-icons/web";

<ReiconIcon name="ShieldCheck" size={24} weight="Filled" />;
```

## Source

`code/packages/web/ui-icons/src/web/ReiconIcon.tsx`
