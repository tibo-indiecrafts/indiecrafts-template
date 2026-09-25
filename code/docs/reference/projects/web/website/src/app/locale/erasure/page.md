---
title: "Erasure request page"
description: "Anonymous route that renders the account-erasure request form."
status: stable
---

# Erasure request page

> The `/erasure` route — a thin shell over the anonymous erasure-request form.

## Purpose

Server route for `/<locale>/erasure`. It renders `ErasureRequestForm` with copy resolved here from `messages.legal.erasure.request.*` and emits per-page JSON-LD. Gated by `features.legal.erasure` via `isPageVisible`; the flow is anonymous (no Clerk gate) and includes a Turnstile challenge. Posts to the shared api's public `POST /v1/erasure/request`. Fail-safe: with no `NEXT_PUBLIC_API_URL` the whole page 404s.

## Exports

- `generateMetadata` — SEO metadata for `pages.erasure`.
- `ErasurePage` (default) — the async server component.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/erasure/page.tsx`
