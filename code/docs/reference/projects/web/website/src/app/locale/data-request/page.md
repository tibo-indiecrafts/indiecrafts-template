---
title: "Data-request page"
description: "Route that renders the GDPR data-request form with localized copy."
status: stable
---

# Data-request page

> The `/data-request` route — a thin shell over the shared GDPR request form.

## Purpose

Server route for `/<locale>/data-request`. It renders `DataRequestForm` (from `@indiecrafts/packages-web-ui-components`) with copy resolved here from `messages.legal.dataRequest.*` and request-type options from `DATA_REQUEST_TYPES`. Gated by `features.legal.dataRequest` via `isPageVisible`; the form posts to `/api/data-request`. A link to `/erasure` sits above the form.

## Exports

- `generateMetadata` — builds SEO metadata for `pages.dataRequest`.
- `DataRequestPage` (default) — the async server component; calls `notFound()` when the feature is off.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/data-request/page.tsx`
