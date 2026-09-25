---
title: "Web app manifest"
description: "Builds the PWA Web App Manifest from Sanity settings and theme hex colors."
status: stable
---

# Web app manifest

> Emits the web manifest — install name, icons, and colors — sourced from Sanity.

## Purpose

The default export is Next.js's Metadata `manifest` route. It builds the Web App Manifest from Sanity: the install name and description from site settings and SEO, PWA icons resized from `siteSettings.icon` via the CDN (192 / 512), and `theme_color`/`background_color` from `theme.hexColors` (hex mirrors of the oklch tokens). Icons are empty when unset — Sanity is the sole source, with no static fallback.

## Exports

- `default` (`manifest`) — async; returns a `MetadataRoute.Manifest`.

## Source

`code/projects/web/surfaces/website/src/app/manifest.ts`
