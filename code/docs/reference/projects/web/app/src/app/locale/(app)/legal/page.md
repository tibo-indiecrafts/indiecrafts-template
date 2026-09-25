---
title: "App legal page"
description: "Lists the marketing site's legal pages and links out to each."
status: stable
---

# App legal page

> Cross-origin links to the canonical legal pages.

## Purpose

The legal link-out on the app surface. The canonical legal pages live on the marketing website, so this page lists them and opens each there with `legalUrl(site.websiteUrl, …)`. No content is re-hosted; each item is a plain cross-origin `<a>`, not the typed `Link`.

## Exports

- `default` — the `LegalPage` route component.

## Source

`code/projects/web/surfaces/app/src/app/[locale]/(app)/legal/page.tsx`
