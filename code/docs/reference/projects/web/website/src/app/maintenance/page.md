---
title: "Maintenance page"
description: "Renders the maintenance status page from Sanity copy with message fallbacks."
status: stable
---

# Maintenance page

> Draws the branded maintenance screen, Sanity-first with `messages/<locale>.json` fallbacks.

## Purpose

`MaintenancePage` renders the branded `Maintenance` system page. Copy comes from Sanity (`siteMeta.<locale>.systemPages.maintenance`) per field, falling back to `messages/<locale>.json` so the page still renders if Sanity is down. `generateMetadata` sets the title and marks the page `noindex`.

## Exports

- `generateMetadata()` — async; returns the page `Metadata` with `robots: { index: false, follow: false }`.
- `default` (`MaintenancePage`) — async server component rendering the `Maintenance` status page.

## Source

`code/projects/web/surfaces/website/src/app/maintenance/page.tsx`
