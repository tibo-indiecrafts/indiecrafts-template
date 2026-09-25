---
title: "Erasure confirm page"
description: "Anonymous erasure-confirm route opened from an emailed token-bearing link."
status: stable
---

# Erasure confirm page

> The `/erasure/confirm` route — a signed-out visitor confirms erasure by typing their email.

## Purpose

Server route for `/<locale>/erasure/confirm`. It renders `ErasureConfirmForm` with copy resolved here from `messages.legal.erasure.confirm.*` and passes the `?token=` query through. Gated by `features.legal.erasure` (the same flag as `/erasure`; no separate `pages` entry). The metadata canonicalizes to `/erasure/confirm`. Posts to the shared api's public `POST /v1/erasure/confirm`. Fail-safe: with no `NEXT_PUBLIC_API_URL` the whole page 404s.

## Exports

- `generateMetadata` — SEO metadata for `pages.erasure`, canonical `/erasure/confirm`.
- `ErasureConfirmPage` (default) — the async server component.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/erasure/confirm/page.tsx`
