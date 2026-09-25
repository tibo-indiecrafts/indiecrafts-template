---
title: "Auth package entry"
description: "Public barrel for the DOM-free role authorization contract."
status: stable
---

# Auth package entry

> The single import surface for the portable role contract.

## Purpose

Re-exports the role authorization contract from `roles.ts`. The package is pure and framework-agnostic, so every platform's Clerk SDK reads the same role off the signed session token.

## Exports

- `Roles` — the gated-role union type.
- `AppSessionClaims` — the custom session-token claim shape.
- `isAdmin` — the strict admin check.

## Usage

```ts
import {
  isAdmin,
  type AppSessionClaims,
} from "@indiecrafts/packages-shared-auth";
```

## Source

`code/packages/shared/auth/src/index.ts`
