---
title: "Erasure adapters barrel"
description: "Re-exports the erasure adapter factories and client interfaces from one module."
status: stable
---

# Erasure adapters barrel

> One import path for the D1, Clerk, Sanity, Resend, and orders erasure adapters.

## Purpose

Re-exports the erasure adapter factories and their client interfaces so callers import them from a single module. It aggregates the D1, Clerk, Sanity, Resend, and orders adapters.

## Exports

- `createCoreErasureAdapter`, `createAuditErasureAdapter`, `resolveSubject` — from `./d1`.
- `createClerkErasureAdapter`, `ClerkErasureClient` — from `./clerk`.
- `createSanityErasureAdapter`, `SanityErasureClient` — from `./sanity`.
- `createResendErasureAdapter` — from `./resend`.
- `createOrdersErasureAdapter` — from `./orders`.

## Usage

```ts
import {
  createCoreErasureAdapter,
  createClerkErasureAdapter,
  createSanityErasureAdapter,
  createOrdersErasureAdapter,
} from "@indiecrafts/api/erasure";
```

## Source

`code/shared/api/src/erasure/index.ts`
