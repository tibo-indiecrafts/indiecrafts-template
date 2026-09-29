---
title: "Legal consent endpoint"
description: "Authenticated GET/POST handler for a signed-in user's accepted legal version, keyed on the Clerk JWT — so the re-acceptance banner follows them across surfaces."
status: stable
---

# Legal consent endpoint

> The authenticated self-service route that makes the "policies updated" banner follow a signed-in user across website · app · mobile — accept on one, cleared on all.

## Purpose

Implements the authenticated legal re-acceptance endpoint for the shared API worker. A signed-in user reads (`GET`) and records (`POST`) the policy version they last accepted; the Clerk session JWT proves identity, so the route keys on the JWT `sub` and never exposes a bearer token to the browser. Anonymous visitors keep their per-surface local deposit (cookie / AsyncStorage) — there is no shared identity to sync them by.

A `POST` writes the append-only proof to `consent_events` (`consent_type = 'legal_reaccept'`, one row per accepted version via `INSERT OR IGNORE` so re-accepting is idempotent) and updates the current-state cache column `user_profiles.legal_acked_version` (migration `0011`).

Routes handled:

- `GET /v1/consent/legal` returns `{ legal_acked_version }` — the version the caller last accepted, or `null`.
- `POST /v1/consent/legal` records `{ version, surface? }` and returns `{ ok: true }`.

It enforces `OPTIONS` (CORS preflight), method allow-listing, a `503` when `MAIN_DB` or the Clerk key is missing, optional rate limiting, a `401` for an unverified caller, a body-size cap, and a `400` on a missing version.

## Exports

- `handleLegalConsent(request, env, ctx?, authenticate?)` — the route handler; `authenticate` is injectable so tests avoid the Clerk SDK. Defaults to `verifyUserId` from `./marketing`.

## Usage

```ts
import { handleLegalConsent } from "./consent/legal";

// In the worker's fetch router:
if (url.pathname === "/v1/consent/legal") {
  return handleLegalConsent(request, env, ctx);
}
```

The client half lives in `@indiecrafts/packages-shared-compliance/shared` (`readLegalConsent` / `writeLegalConsent`), called by the `app` and Expo re-acceptance gates.

## Source

`code/shared/api/src/consent/legal.ts`
