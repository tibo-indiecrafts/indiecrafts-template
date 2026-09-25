---
title: "Self-service erasure route"
description: "Authenticated route where a signed-in user erases their own data behind a Clerk JWT, step-up, and typed-email gate."
status: stable
---

# Self-service erasure route

> A signed-in user erases their own data with no email round-trip.

## Purpose

Handles `/v1/erasure/self`. The Clerk session JWT proves identity, a step-up reverification gate blocks a stale session, and a typed-email match against the authenticated identity is the deliberate-action gate. It then runs the erasure engine live, mirroring `confirm.ts` (same engine and receipt handling) but with identity from the JWT rather than a mailed token. It is the only writer of `churn_events`: it captures the exit survey and suppresses the departing Resend contact. A failed Clerk delete is retried once inline and, if it still fails, returns 502 with `clerk_failed: true`.

## Exports

- `CLERK_STORE` — the `name` the Clerk adapter registers under (`"clerk"`).
- `SelfAuth` — re-exported from `../auth/sensitive-action` so existing importers keep resolving it here.
- `handleErasureSelf(request, env, ctx?, buildAdapters?, authenticate?, suppress?, fetchPrefs?, send?)` — the route handler; the trailing params are injectable for tests.

## Usage

```ts
import { handleErasureSelf } from "@indiecrafts/api/erasure/self";

if (url.pathname === "/v1/erasure/self")
  return handleErasureSelf(request, env, ctx);
```

## Source

`code/shared/api/src/erasure/self.ts`
