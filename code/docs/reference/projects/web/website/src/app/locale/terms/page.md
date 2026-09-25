---
title: "Terms of use page"
description: "Route that renders the localized terms-of-use (CGU) page from Sanity content."
status: stable
---

# Terms of use page

> The `/terms` route — a thin shell around the shared legal-page renderer.

## Purpose

Server route for `/<locale>/terms`. It gates visibility with `isPageVisible(pages.terms)`, emits per-page JSON-LD, and delegates the body to `LegalPageContent` with `pageKey="cgu"`. Content lives in Sanity, resolved per locale.

## Exports

- `generateMetadata` — SEO metadata for `pages.terms`.
- `TermsPage` (default) — the async server component; calls `notFound()` when the page is hidden.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/terms/page.tsx`
