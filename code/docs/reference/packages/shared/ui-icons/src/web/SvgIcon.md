---
title: "Custom SVG icon (web)"
description: "Web renderer that draws a registered custom SVG mark by name as an inline SVG."
status: stable
---

# Custom SVG icon (web)

> Draws a registered custom SVG mark by name on the web.

## Purpose

The web renderer for the custom-SVG registry. It reads a `SvgName` entry from the shared `SVGS` data and draws its `viewBox` and `path` as an inline `<svg>`, tinted with `currentColor` and marked `aria-hidden`.

## Exports

- `SvgIconProps` — type: `SVGProps` plus a required `name` of `SvgName`.
- `SvgIcon` — component that renders the named custom mark.

## Usage

```tsx
import { SvgIcon } from "@indiecrafts/packages-shared-ui-icons/web";

<SvgIcon name="logo-mark" className="size-8" />;
```

## Source

`code/packages/shared/ui-icons/src/web/SvgIcon.tsx`
