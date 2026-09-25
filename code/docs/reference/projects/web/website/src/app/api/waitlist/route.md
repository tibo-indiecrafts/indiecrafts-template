---
title: "Waitlist join endpoint"
description: "Public POST endpoint that accepts a waitlist join request."
status: stable
---

# Waitlist join endpoint

> New and already-on-the-list answer identically, so membership cannot be enumerated.

## Purpose

Accepts a public waitlist join. `withGuard` hardens the boundary (same-site origin, body cap, rate limit, optional Turnstile) and parses the body once; the module's `join` validates, whitelists, and writes. A honeypot-flagged submission returns `201` too, and new plus already-on-the-list both answer `201` with an identical body, so membership cannot be enumerated. The route `404`s when `features.waitlist` is off, and again when the Studio `enabled` toggle is `false` — a live kill switch that matches the `/waitlist` page.

## Exports

- `POST` — accepts a join payload, returns `201` on success or silent spam, `400` on invalid, `404` when disabled, `500` on error.

## Source

`code/projects/web/surfaces/website/src/app/api/waitlist/route.ts`
