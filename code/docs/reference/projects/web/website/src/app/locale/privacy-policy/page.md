---
title: "Privacy policy page"
description: "Route that renders the localized privacy-policy page from Sanity content."
status: stable
---

# Privacy policy page

> The `/privacy-policy` route — a thin shell around the shared legal-page renderer.

## Purpose

Server route for `/<locale>/privacy-policy`. It gates visibility with `isPageVisible(pages.privacy)`, emits per-page JSON-LD, and delegates the body to `LegalPageContent` with `pageKey="confidentialite"`. Content lives in Sanity, resolved per locale.

## Exports

- `generateMetadata` — SEO metadata for `pages.privacy`.
- `PrivacyPolicyPage` (default) — the async server component; calls `notFound()` when the page is hidden.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/privacy-policy/page.tsx`
