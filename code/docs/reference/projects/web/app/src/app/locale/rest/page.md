---
title: "Unknown-path catch-all"
description: "Sends every unknown app path to the localized, branded 404."
status: stable
---

# Unknown-path catch-all

> Sends every unknown app path to the localized, branded 404.

## Purpose

Calls `notFound()` for any path no route matches. Without it an unknown path falls through to the root not-found, outside `[locale]` — where the passthrough root layout has no `<html>`/`<body>`: a runtime error in dev, Next's bare 404 in production (also inside the mobile shell). With it, `[locale]/not-found` renders instead.

## Exports

- default export `CatchAll()` — always `notFound()`.

## Source

`code/projects/web/surfaces/app/src/app/[locale]/[...rest]/page.tsx`
