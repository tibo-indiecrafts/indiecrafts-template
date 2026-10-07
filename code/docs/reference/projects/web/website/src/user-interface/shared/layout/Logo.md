---
title: "Brand logo"
description: "Presentational brand lockup — a theme-aware Sanity logo image plus the site-name wordmark."
status: stable
---

# Brand logo

> Logo mark plus wordmark, theme-safe with no JS.

## Purpose

Renders the brand lockup: a logo mark and the site-name wordmark. Logo URLs come from Sanity (`siteSettings.logo` / `logoDark`), fetched server-side and passed in, so the component stays presentational and can render inside the client `Header`. When a dark logo is set, both images render and a pure-CSS `dark:` swap shows the right one for light / dark / system / forced themes. With no logo, the wordmark renders alone. Raster logos are CDN-sized (2x the slot for retina); the loader leaves SVG untouched via `unoptimized`. The image has an empty `alt`: the wordmark beside it always names the site, so naming the image too made screen readers say the name twice.

## Exports

- `Logo` — the lockup component; props `name`, optional `logo` / `logoDark` URLs, `className`, and `iconClassName`.

## Usage

```tsx
import { Logo } from "@/user-interface/shared/layout/Logo";

<Logo name={name} logo={brand.logo} logoDark={brand.logoDark} />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/shared/layout/Logo.tsx`
