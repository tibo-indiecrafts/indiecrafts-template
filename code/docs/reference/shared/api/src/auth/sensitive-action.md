---
title: "Sensitive-action gate"
description: "Shared Clerk-JWT auth plus step-up reverification for self-service erasure and data export."
status: stable
---

# Sensitive-action gate

> One source of truth for authenticating and step-up-gating per-user sensitive actions.

## Purpose

Resolves the caller of a sensitive action from their Clerk session JWT and enforces step-up reverification. Extracted from copies that lived in both `erasure/self.ts` and `export/route.ts` so the two paths cannot drift. It fails closed: any missing token, secret, or verify failure resolves to unauthenticated.

## Exports

- `SelfAuth` — the resolved caller: `userId`, `email`, and `fvaMinutes` (first-factor age from the JWT `fva` claim).
- `REVERIFY_WINDOW_MIN` — Clerk's step-up window in minutes (10).
- `authenticateClerkJwt(request, env)` — verifies the JWT and resolves the primary email and first-factor age; returns `SelfAuth` or `null`.
- `requireStepUp(authed, cors, afterMinutes?)` — returns a 403 reverification `Response` for a stale session, or `null` when fresh enough.

## Usage

```ts
import { authenticateClerkJwt, requireStepUp } from "../auth/sensitive-action";

const authed = await authenticateClerkJwt(request, env);
if (!authed) return new Response("unauthorized", { status: 401 });
const challenge = requireStepUp(authed, cors);
if (challenge) return challenge;
```

## Source

`code/shared/api/src/auth/sensitive-action.ts`
