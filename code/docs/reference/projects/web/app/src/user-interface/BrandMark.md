---
title: "Brand mark"
description: "Renders the configured logo on the app's 404 and error screens."
status: stable
---

# Brand mark

> Renders the configured logo on the app's 404 and error screens.

## Purpose

Presentational. Renders the Sanity logo CDN-sized (`?h=96&fit=max&auto=format`, a raw `<img>` with explicit params) at 48px; with `logoDark` set, a pure-CSS `dark:` swap shows the right one. No brand → renders nothing.

## Exports

- `BrandMark({ brand })`.

## Source

`code/projects/web/surfaces/app/src/user-interface/BrandMark.tsx`
