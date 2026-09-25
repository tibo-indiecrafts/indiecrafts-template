---
title: "Terms of sale page"
description: "Route that renders the localized terms-of-sale (CGV) page from Sanity content."
status: stable
---

# Terms of sale page

> The `/terms-of-sale` route — a thin shell around the shared legal-page renderer.

## Purpose

Server route for `/<locale>/terms-of-sale`. It gates visibility with `isPageVisible(pages.termsOfSale)`, emits per-page JSON-LD, and delegates the body to `LegalPageContent` with `pageKey="cgv"`. Content lives in Sanity, resolved per locale.

## Exports

- `generateMetadata` — SEO metadata for `pages.termsOfSale`.
- `TermsOfSalePage` (default) — the async server component; calls `notFound()` when the page is hidden.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/terms-of-sale/page.tsx`
