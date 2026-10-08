---
title: "Newsletter confirm endpoint"
description: "Confirms a newsletter double opt-in from a one-time token — POST only."
status: stable
---

# Newsletter confirm endpoint

> POST only, so a mail scanner or link prefetcher cannot auto-confirm.

## Purpose

Confirms a newsletter double opt-in. It is `POST` only, so a mail scanner or link prefetcher cannot auto-confirm. The confirmation email links to the `newsletter/confirm` page, whose button POSTs the signed `token` here; `confirmSubscription` verifies it and stores the subscriber in Resend through the api. `withGuard` rate-limits the route and caps the body at 4000 bytes (the token is the auth, so no Turnstile). The route `404`s when the newsletter feature is off; otherwise it answers `{ status: "confirmed" | "invalid" }`, or `502 { status: "error" }` when the subscriber could not be stored.

## Exports

- `POST` — confirms the sign-up in a `token`; returns the status, `502` on a storage failure, or `404` when disabled.

## Source

`code/projects/web/surfaces/website/src/app/api/newsletter/confirm/route.ts`
