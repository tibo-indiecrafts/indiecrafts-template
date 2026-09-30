---
title: "API worker entry"
description: "The bare Cloudflare Worker entrypoint — the fetch router for every /v1 route plus the Env bindings and shared guard helpers."
status: stable
---

# API worker entry

> The fetch router and shared helpers for the standalone JSON API worker.

## Purpose

The entrypoint for the standalone API — a bare Cloudflare Worker (no Next/OpenNext) serving the web surfaces' servers and partners. Its default `fetch` export routes `/health`, `/v1/events` (the audit + session sink), the admin read routes, the Clerk webhook, the public announcements read, and the GDPR erasure, export, and consent routes. `withGuard` is Next-only, so this worker re-implements a tiny inline guard: a bearer token, the Cloudflare native rate-limit binding, a body cap, and CORS. The route logic lives in bricks and sibling modules; this file is the shell and dispatch. The router is `route`; the default `fetch` wraps it with a request id, the Idempotency-Key layer (`idempotency.ts`), a top-level catch and `finalize` (`http.ts`). The bearer-authed `/health` reports both D1s, the build (`BUILD_VERSION`/`BUILD_COMMIT`, stamped by the deploy) and the bindings.

## Exports

- `Env` — the worker's bindings and secrets interface (D1s, KV, R2, Clerk, Sanity, Resend, salts, and more).
- `corsHeaders(origin)` — builds CORS headers for a browser origin in the dev allowlist.
- `safeEqual(a, b)` — constant-time string compare, so timing does not leak a mismatch.
- `clientIp(req)` — the `cf-connecting-ip` value, or `"unknown"`.
- `PUBLIC_CORS`, `PUBLIC_CORS_POST` — CORS header constants for the public routes.
- `default` — the `ExportedHandler<Env>`: `fetch` = request id → idempotency → `route` → catch → `finalize`.

## Usage

```ts
import { safeEqual, clientIp, PUBLIC_CORS } from "@indiecrafts/api";

if (!safeEqual(bearer, env.APP_API_TOKEN)) {
  // reject
}
```

## Source

`code/shared/api/src/index.ts`
