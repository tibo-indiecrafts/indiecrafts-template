---
title: "Legal notice page"
description: "Route that renders the localized legal-notice (mentions légales) page from Sanity."
status: stable
---

# Legal notice page

> The `/legal-notice` route — a thin shell around the shared legal-page renderer.

## Purpose

Server route for `/<locale>/legal-notice`. It gates visibility with `isPageVisible(pages.legalNotice)`, emits per-page JSON-LD, and delegates the body to `LegalPageContent` with `pageKey="mentions-legales"`. Content lives in Sanity, resolved per locale.

## Exports

- `generateMetadata` — SEO metadata for `pages.legalNotice`.
- `LegalNoticePage` (default) — the async server component; calls `notFound()` when the page is hidden.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/legal-notice/page.tsx`
