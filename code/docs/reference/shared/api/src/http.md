---
title: "API HTTP edge"
description: "Request ids, the error envelope, 429 retry hints, the top-level catch and outbound timeouts."
status: stable
---

# API HTTP edge

> The one exit point every api response passes through.

## Purpose

The default `fetch` in `src/index.ts` wraps the router with these helpers, so the route handlers keep returning a plain `{ error: "<code>" }`. `finalize` adds `X-Request-Id` to every response and, to a JSON error, `message` (from `ERROR_MESSAGES`) and `requestId`; a `rate_limited` 429 gains `Retry-After` and `RateLimit-Policy`. Non-JSON and success bodies pass through unbuffered (the export download streams). `errorFromThrow` turns an uncaught throw into `500 internal`, or `503 schema_behind` for a missing D1 table or column. `fetchWithTimeout` and `withTimeout` bound every outbound call to 5 s; a guard test (`code/shared/scripts/lib/api-outbound.test.mjs`) fails on a bare `fetch(`.

## Exports

- `requestIdOf(request)` — `cf-ray`, else a uuid.
- `finalize(response, requestId)`
- `errorFromThrow(error, requestId)`
- `fetchWithTimeout(input, init?, ms = 5000)` and `withTimeout(promise, ms = 5000, label)`
- `ERROR_MESSAGES`, `RATE_LIMIT` (`{ limit: 20, period: 60 }`, mirrors wrangler.toml).

## Source

`code/shared/api/src/http.ts`
