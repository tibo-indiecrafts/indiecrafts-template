---
title: "Clerk erasure adapter"
description: "The erasure adapter for Clerk, whose erasure is deletion — anonymize is a no-op."
status: stable
---

# Clerk erasure adapter

> Clerk holds identity and credentials, so its erasure is a user delete.

## Purpose

Implements the compliance `ErasureAdapter` for Clerk. Clerk holds the identity and credentials; there is no "pseudonymised Clerk user" (the pseudonymised proof lives in D1 and Sanity), so `anonymize()` is a no-op and `delete()` removes the user. The real Clerk surface is passed in as `ClerkErasureClient`, which keeps this adapter unit-testable with a mock and defers the secret and SDK to the caller.

## Exports

- `ClerkErasureClient` — the minimal Clerk surface the adapter needs: `findUserIdByEmail`, `exportUser`, `deleteUser`.
- `createClerkErasureAdapter(client)` — returns the `ErasureAdapter` named `clerk` (`findByEmail`, `export`, `preview`, `anonymize` no-op, `delete`).

## Usage

```ts
import { createClerkErasureAdapter } from "@indiecrafts/api/erasure/clerk";
import { createRealClerkClient } from "@indiecrafts/api/erasure/clerk-client";

const adapter = createClerkErasureAdapter(
  createRealClerkClient(env.CLERK_SECRET_KEY),
);
```

## Source

`code/shared/api/src/erasure/clerk.ts`
