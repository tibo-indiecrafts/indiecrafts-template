---
title: "Newsletter confirm endpoint"
description: "Confirms a newsletter double opt-in from a one-time token — POST only."
status: stable
---

# Newsletter confirm endpoint

> POST only, so a mail scanner or link prefetcher cannot auto-confirm.

## Purpose

Confirms a newsletter double opt-in. It is `POST` only, so a mail scanner or link prefetcher cannot auto-confirm. The confirmation email links to the `newsletter/confirm` page, whose button POSTs the one-time `token` here; `confirmSubscriber` verifies it. `withGuard` rate-limits the route (the token is the auth, so no Turnstile). The route `404`s when the newsletter feature is off, and otherwise returns a confirmed or invalid status.

## Exports

- `POST` — confirms the subscriber for a `token`, returns the confirm status or `404` when disabled.

## Source

`code/projects/web/surfaces/website/src/app/api/newsletter/confirm/route.ts`
