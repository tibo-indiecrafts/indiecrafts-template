---
title: "Role authorization contract"
description: "The DOM-free role union, session-claim shape, and the strict admin gate."
status: stable
---

# Role authorization contract

> The framework-agnostic authorization contract every platform's Clerk SDK reads.

## Purpose

Defines the app's authorization contract without any Clerk, React, or Next import. The role lives in Clerk `publicMetadata` (backend-writable only, so tamper-proof) and rides the session JWT via the dashboard `metadata` claim. `isAdmin` reads that claim.

## Exports

- `Roles` — the gated-role union. Currently just `"admin"`; widen it when a second gated role ships.
- `AppSessionClaims` — the custom session-token claim shape (`metadata.role`). Each app augments Clerk's ambient `CustomJwtSessionClaims` from this type.
- `isAdmin(claims)` — returns `true` only when the claim carries `role: "admin"`. Safe on `null`, `undefined`, or malformed claims. Enforce it server-side; middleware is coarse routing and is bypassable.

## Usage

```ts
import { isAdmin } from "@indiecrafts/packages-shared-auth";

if (!isAdmin(sessionClaims)) {
  throw new Error("Forbidden");
}
```

## Source

`code/packages/shared/auth/src/roles.ts`
