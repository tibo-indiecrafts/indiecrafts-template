---
title: "API security policy"
description: "Per-route request-boundary limits for the public API guard."
status: stable
---

# API security policy

> One home for every `withGuard` limit — rate window, body cap, and Turnstile opt-in.

## Purpose

`security` is the per-route request-boundary policy for the public API, so the security posture is reviewable in one place. Each key is passed into `withGuard(handler, security.<name>)` (or, for `moderate`, a direct `rateLimit()` call): `rateLimit` picks the tier, `bodyMax` caps bytes, and `turnstile` opts the route into the bot check. These are defence-in-depth — the Cloudflare WAF is the primary limiter, and the KV rate-limit and Turnstile fail open until the operator binds `RATE_LIMIT_KV` and sets `TURNSTILE_SECRET`.

## Exports

- `security` — the map of route names to guard config (`newsletter`, `waitlist`, `contact`, `comments`, `dataRequest`, `confirm`, `moderate`).

## Usage

```ts
import { security } from "@/config";

export const POST = withGuard(handler, security.newsletter);
```

## Source

`code/projects/web/surfaces/website/src/config/security.ts`
