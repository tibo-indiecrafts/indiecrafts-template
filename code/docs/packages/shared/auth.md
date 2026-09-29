---
title: "@indiecrafts/packages-shared-auth"
description: The portable, DOM-free authorization contract every platform's Clerk SDK reads.
status: stable
order: 1
---

# `@indiecrafts/packages-shared-auth` — role contract (DOM-free)

## Purpose

> One home for the app's role contract — no Clerk, React, or Next import.

`@indiecrafts/packages-shared-auth` is the framework-agnostic authorization core. It holds the
gated-role union, the session-claim shape, and the admin gate. It has no dependencies (the
`shared/` scope rule), so every platform's Clerk SDK (`@clerk/nextjs`,
`@clerk/clerk-react`) reads the same role off the signed session JWT.

## Exports

The root `.` barrel (also `./roles`):

- **`isAdmin(claims)`** — the only exported gate. `true` only when the claim carries exactly
  `role: "admin"`. Null-safe — returns `false` on `null`, `undefined`, or a malformed claim.
- **`Roles`** — the gated-role union. Currently just `"admin"`. Widen it when a second gated role
  ships.
- **`AppSessionClaims`** — the custom session-token claim shape (`metadata.role`). The single home
  for the shape; each app augments Clerk's ambient `CustomJwtSessionClaims` from this type.

The role lives in Clerk `publicMetadata` (backend-writable only, so tamper-proof) and rides the JWT
via a dashboard session-token claim:

```json
{ "metadata": "{{user.public_metadata}}" }
```

## Usage example

Augment the ambient claims from the shared shape, then enforce the gate **server-side**.

```ts
// <app>/src/types/globals.d.ts — one home for the claim shape
import type { AppSessionClaims } from "@indiecrafts/packages-shared-auth";
declare global {
  interface CustomJwtSessionClaims extends AppSessionClaims {}
}
export {};
```

```ts
// a server action / route handler — never rely on middleware alone (CVE-2025-29927)
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@indiecrafts/packages-shared-auth";

const { sessionClaims } = await auth();
if (!isAdmin(sessionClaims)) throw new Error("forbidden");
```

## Consumers

- **`@indiecrafts/packages-web-auth`** — the web tier that wraps the themed provider.
- The three Next surfaces — **`website`**, **`admin`**, **`app`** — augment their ambient claims
  from `AppSessionClaims`.

Source → [`code/packages/shared/auth/`](/packages/shared/auth). Full design →
[auth architecture](/shared/architecture/auth). The DOM-coupled web provider lives in
[`@indiecrafts/packages-web-auth`](../web/auth).
