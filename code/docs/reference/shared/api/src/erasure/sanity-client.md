---
title: "Sanity erasure client"
description: "Real SanityErasureClient over the Sanity HTTP API — GROQ query for lookup, mutate for pseudonymise."
status: stable
---

# Sanity erasure client

> The concrete Sanity client the erasure adapter calls to find and pseudonymise documents.

## Purpose

Implements `SanityErasureClient` over the Sanity HTTP API. The bare Worker cannot use `next-sanity`/`writeClient` (both are `server-only`), so this reads via `/data/query` (GROQ) and writes via `/data/mutate`. The read token is optional; the write token is required for pseudonymise.

## Exports

- `createRealSanityClient(cfg)` — returns a `SanityErasureClient`. `cfg` carries `projectId`, `dataset`, `apiVersion`, `writeToken`, and an optional `readToken`.

## Usage

```ts
import { createRealSanityClient } from "@indiecrafts/api/erasure/sanity-client";
import { createSanityErasureAdapter } from "@indiecrafts/api/erasure/sanity";

const adapter = createSanityErasureAdapter(
  createRealSanityClient({
    projectId: env.SANITY_PROJECT_ID,
    dataset: env.SANITY_DATASET,
    apiVersion: env.SANITY_API_VERSION ?? "2025-01-01",
    writeToken: env.SANITY_API_WRITE_TOKEN,
    readToken: env.SANITY_API_READ_TOKEN,
  }),
  env.GDPR_FINGERPRINT_SALT,
);
```

## Source

`code/shared/api/src/erasure/sanity-client.ts`
