---
title: "Brand logo read"
description: "Reads the configured brand logo from Sanity siteSettings for the app's service screens."
status: stable
---

# Brand logo read

> Reads the configured brand logo from Sanity siteSettings for the app's service screens.

## Purpose

The logo is configured once, in Sanity `siteSettings` (`logo`, optional `logoDark`, `siteName`) — the same source the website reads. Read live through `liveQuery`; `null` when no logo is configured or Sanity is unreachable.

## Exports

- `getBrand()` → `Promise<Brand | null>`.
- `Brand` (type) — `{ name, logo, logoDark }` (Sanity CDN URLs).

## Source

`code/projects/web/surfaces/app/src/lib/brand.ts`
