---
title: "Brand icon (web)"
description: "Web renderer that draws a brand or social mark by name as an inline SVG."
status: stable
---

# Brand icon (web)

> Draws a brand or social mark by name on the web.

## Purpose

The web renderer for brand marks. It looks up the named mark in the shared `BRANDS` data and draws it as an inline `<svg>` with an accessible label. It inherits `currentColor` by default, or paints the official brand hex when `brandColor` is set.

## Exports

- `BrandIconProps` — type: `SVGProps` plus `name` (`BrandName`), an optional `size`, and an optional `brandColor`.
- `BrandIcon` — component that renders the named mark.

## Usage

```tsx
import { BrandIcon } from "@indiecrafts/packages-shared-ui-icons/web";

<BrandIcon name="github" size={20} />
<BrandIcon name="facebook" brandColor />
```

## Source

`code/packages/shared/ui-icons/src/web/BrandIcon.tsx`
