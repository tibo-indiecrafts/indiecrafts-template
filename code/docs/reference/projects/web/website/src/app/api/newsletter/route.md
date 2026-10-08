---
title: "Newsletter signup endpoint"
description: "Public POST endpoint that accepts a newsletter subscription."
status: stable
---

# Newsletter signup endpoint

> Every real sign-up answers the same, so membership cannot be enumerated.

## Purpose

Accepts a public newsletter signup. `withGuard` hardens the boundary (same-site origin, body cap, rate limit, optional Turnstile) and parses the body once; `subscribe` validates and emails the signed double opt-in link; nothing is stored until the visitor confirms. A honeypot-flagged submission returns `201` too, and every real sign-up answers `201` with an identical body, so membership cannot be enumerated. The route `503`s when the newsletter's setup is missing and `404`s when the feature is off.

## Exports

- `POST` — accepts a signup payload, returns `201` on success or silent spam, `400` on invalid, `503` when the setup is missing, `404` when disabled, `500` on error.

## Source

`code/projects/web/surfaces/website/src/app/api/newsletter/route.ts`
