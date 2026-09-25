---
title: "Clerk erasure client"
description: "Real ClerkErasureClient over @clerk/backend, with an injectable factory that dynamically imports the SDK."
status: stable
---

# Clerk erasure client

> The concrete Clerk client the erasure adapter calls to find, export, and delete a user.

## Purpose

Implements `ClerkErasureClient` over `@clerk/backend`. The factory param is injectable so tests supply a fake client and never load the real SDK. The default factory dynamically imports `@clerk/backend`, keeping it out of the module graph until erasure actually runs. `CLERK_SECRET_KEY` is required.

## Exports

- `createRealClerkClient(secretKey, clerkFactory?)` — returns a `ClerkErasureClient` whose `findUserIdByEmail`, `exportUser`, and `deleteUser` methods call the Clerk backend API.

## Usage

```ts
import { createRealClerkClient } from "@indiecrafts/api/erasure/clerk-client";
import { createClerkErasureAdapter } from "@indiecrafts/api/erasure/clerk";

const adapter = createClerkErasureAdapter(
  createRealClerkClient(env.CLERK_SECRET_KEY),
);
```

## Source

`code/shared/api/src/erasure/clerk-client.ts`
