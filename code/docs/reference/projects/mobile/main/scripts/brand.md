---
title: "Shell branding"
description: "Pulls the configured Sanity logo into the shell's service screens: the offline page and the native splash."
status: stable
---

# Shell branding

> Pulls the configured Sanity logo into the shell's service screens: the offline page and the native splash.

## Purpose

The logo is configured once, in Sanity `siteSettings` (`logo`, optional `logoDark`). No static copy and no image tool: the shell asks Sanity's image CDN for exactly what it needs — the logo for the offline page (`www/brand/`), and each native splash image (Android 11 + iOS 3) at its own size with the logo centred at 18% of the visible short side (`SPLASH_LOGO_SHARE`). iOS fills a portrait phone from one square image, so only ~46% of its width shows — a square splash shrinks the logo by that much to look the same size. `build-www` re-renders the splashes only when the logo or its size changes; the committed `brand.lock.json` records the logo they came from. Never throws: no config or no network keeps the existing images.

## Exports

- `fetchBrand({ projectId, dataset })` → `{ logo, logoDark } | null`.
- `logoUrl(asset)` · `splashUrl(asset, w, h, bg?)` — the CDN URLs.
- `pngSize(buf)` · `download(url, file)` · `renderSplashes(asset, files)`.

## Source

`code/projects/mobile/surfaces/main/scripts/brand.mjs`
