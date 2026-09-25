---
title: "Cookie policy page"
description: "Route that renders the localized cookie-policy legal page from Sanity content."
status: stable
---

# Cookie policy page

> The `/cookie-policy` route — a thin shell around the shared legal-page renderer.

## Purpose

Server route for `/<locale>/cookie-policy`. It gates visibility with `isPageVisible(pages.cookies)`, emits per-page JSON-LD, and delegates the body to the shared `LegalPageContent` renderer with `pageKey="cookies"`. Content lives in Sanity, resolved per locale.

## Exports

- `generateMetadata` — builds SEO metadata for `pages.cookies` via `buildMetadata`.
- `CookiePolicyPage` (default) — the async server component; calls `notFound()` when the page is hidden.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/cookie-policy/page.tsx`
