---
title: "Newsletter signup endpoint"
description: "Public POST endpoint that accepts a newsletter subscription."
status: stable
---

# Newsletter signup endpoint

> New and already-subscribed answer identically, so membership cannot be enumerated.

## Purpose

Accepts a public newsletter signup. `withGuard` hardens the boundary (same-site origin, body cap, rate limit, optional Turnstile) and parses the body once; `subscribe` validates, dedupes, and writes. A honeypot-flagged submission returns `201` too, and new plus already-subscribed both answer `201` with an identical body, so membership cannot be enumerated. The route `404`s when the newsletter feature is off.

## Exports

- `POST` — accepts a signup payload, returns `201` on success or silent spam, `400` on invalid, `404` when disabled, `500` on error.

## Source

`code/projects/web/surfaces/website/src/app/api/newsletter/route.ts`
