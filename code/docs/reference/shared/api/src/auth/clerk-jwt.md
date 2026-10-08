---
title: "Clerk session JWT"
description: "Verifies a Clerk session token and returns its claims — the one verify path for signed-in api routes."
status: stable
---

# Clerk session JWT

> One verify path for every signed-in api route.

## Purpose

Verifies the `Authorization: Bearer <jwt>` session token that the web surfaces send. `@clerk/backend` v3 `verifyToken` returns the claims and throws on an invalid, expired or forged token. It has no `{ data, errors }` result; reading one rejected every valid token. Every signed-in route goes through this helper: the legal and marketing-email consent routes (`verifyUserId`) and the step-up routes (`authenticateClerkJwt`). It fails closed: any failure returns `null`.

## Exports

- `verifyClerkClaims(token, options)` — the claims (`sub`, `fva`) of a valid token, else `null`. `options` are `verifyToken` options (`secretKey`, or `jwtKey` for a networkless check).
- `bearerToken(request)` — the request's bearer token, or `""`.
- `verifyUserId(request, env)` — the caller's user id (`sub`) from the request's Clerk session JWT, or `null` (no `CLERK_SECRET_KEY`, or any verify failure). The default `authenticate` of the self-service consent routes.
- `ClerkClaims` (type) — `{ sub, fva? }`.

## Usage

```ts
import { bearerToken, verifyClerkClaims } from "./auth/clerk-jwt";

const claims = await verifyClerkClaims(bearerToken(request), {
  secretKey: env.CLERK_SECRET_KEY,
});
if (!claims) return json({ error: "unauthorized" }, 401);
```

## Source

`code/shared/api/src/auth/clerk-jwt.ts`
