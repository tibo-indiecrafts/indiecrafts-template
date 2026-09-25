---
title: "Marketing consent endpoint"
description: "Authenticated GET/POST handler for a signed-in user's own marketing-email opt-in, keyed on the Clerk JWT."
status: stable
---

# Marketing consent endpoint

> The authenticated self-service route where a signed-in user reads and sets their own marketing-email opt-in.

## Purpose

Implements the authenticated marketing-email consent endpoint for the shared API worker. A signed-in user reads (`GET`) and records (`POST`) their own opt-in; the Clerk session JWT proves identity, so the route keys on the JWT `sub` and never exposes a bearer token to the browser. A `POST` writes an append-only proof row to `consent_events`, updates the `user_profiles.marketing_email` cache column, and best-effort mirrors the decision to the Resend audience (never failing the write).

Routes handled:

- `GET /v1/consent/marketing-email` returns the caller's current opt-in state (`true`, `false`, or `null` when unset).
- `POST /v1/consent/marketing-email` records a decision from a `granted` boolean plus an optional `surface`.

It enforces method allow-listing, a `503` when `MAIN_DB` or the Clerk key is missing, optional rate limiting, a `401` for an unverified caller, and a body-size cap.

## Exports

- `verifyUserId(request, env)` — verifies the Clerk session JWT and returns the caller's user id (`sub`) or `null`; dynamically imports `@clerk/backend` and fails closed.
- `handleMarketingConsent(request, env, ctx?, authenticate?, sync?)` — the route handler; `authenticate` and `sync` are injectable so tests avoid the SDK and network.

## Usage

```ts
import { handleMarketingConsent } from "./consent/marketing";

// In the worker's fetch router:
if (url.pathname === "/v1/consent/marketing-email") {
  return handleMarketingConsent(request, env, ctx);
}
```

## Source

`code/shared/api/src/consent/marketing.ts`
