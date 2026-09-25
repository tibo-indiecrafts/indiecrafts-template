---
title: "Request guard"
description: "A route wrapper that enforces origin, body-cap, rate-limit, and Turnstile checks before a public POST handler runs."
status: stable
---

# Request guard

> Request-boundary hardening for public POST route handlers.

## Purpose

Request-boundary hardening for public POST route handlers, on top of each engine's own validation. `withGuard` wraps a handler and, before it runs, enforces a same-site origin check, a body-size cap, an optional KV rate-limit, and an optional Turnstile verify. It parses the JSON body once and passes it to the handler. Server-only.

## Exports

- `GuardOptions` — the guard config: `origin`, `bodyMax`, `rateLimit`, `turnstile`.
- `clientIp(req)` — the trusted client IP from `cf-connecting-ip` or the first `x-forwarded-for` hop, else `"unknown"`.
- `withGuard(handler, opts?)` — wrap a handler with the origin, body-cap, rate-limit, and Turnstile checks.

## Usage

```ts
import { withGuard } from "@indiecrafts/packages-shared-security/guard";

export const POST = withGuard(
  async (req, body) => {
    // body is the parsed JSON
    return Response.json({ ok: true });
  },
  { rateLimit: { limit: 5, windowSec: 60 }, turnstile: true },
);
```

## Source

`code/packages/shared/security/src/guard.ts`
