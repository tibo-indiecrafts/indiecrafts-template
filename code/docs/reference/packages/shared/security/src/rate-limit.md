---
title: "Rate limiter"
description: "A best-effort fixed-window rate limiter on Workers KV that fails open when the binding is absent."
status: stable
---

# Rate limiter

> A fixed-window limiter on Workers KV; the Cloudflare WAF rule is primary.

## Purpose

A best-effort fixed-window rate limiter backed by Workers KV (binding `RATE_LIMIT_KV`). It no-ops and allows when the binding is absent: the Cloudflare WAF rate-limit rule is the primary limiter, and this is the portable in-app fallback. A KV read or write error never blocks a real request (fail-open). Server-only.

The binding comes from the request context that OpenNext publishes on `globalThis[Symbol.for("__cloudflare-context__")]`. The worker runtime sets it, and `initOpenNextCloudflareForDev` sets it in `next dev`. The limiter reads it directly. A variable-specifier `import("@opennextjs/cloudflare")` cannot resolve inside a Next bundle, so an earlier version never found the binding and never limited.

## Exports

- `rateLimit(key, limit, windowSec)` — increment the window counter for `key`; returns `{ ok, remaining }`. The window resets `windowSec` after the first hit.

## Usage

```ts
import { rateLimit } from "@indiecrafts/packages-shared-security/rate-limit";

const { ok } = await rateLimit(`${ip}:${path}`, 5, 60);
if (!ok) {
  return new Response("rate_limited", { status: 429 });
}
```

## Source

`code/packages/shared/security/src/rate-limit.ts`
