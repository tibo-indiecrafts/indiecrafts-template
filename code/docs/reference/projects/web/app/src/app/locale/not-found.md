---
title: "App 404 screen"
description: "The app's localized 404 with the configured Sanity logo, also shown inside the mobile shell."
status: stable
---

# App 404 screen

> The app's localized 404 with the configured Sanity logo, also shown inside the mobile shell.

## Purpose

Server component. Renders the shared `NotFoundContent` with the brand logo (`getBrand` → `BrandMark`, from Sanity `siteSettings`) in the `brand` slot, and bundled copy from `messages.notFound` (en / fr). No logo configured or Sanity down → the screen renders without it. `noindex`.

## Exports

- default export `NotFound()`; `metadata` (`robots: noindex, nofollow`).

## Source

`code/projects/web/surfaces/app/src/app/[locale]/not-found.tsx`
