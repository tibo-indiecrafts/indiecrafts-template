---
title: "Sanity erasure adapter"
description: "Pseudonymises subject emails in the waitlistEntry Sanity documents."
status: stable
---

# Sanity erasure adapter

> Replaces a subject's email with its fingerprint in the Sanity docs that hold it.

## Purpose

Implements the compliance `ErasureAdapter` for Sanity. It targets the document types that hold a subject email (`waitlistEntry`). These are pseudonymised rather than deleted, so the waitlist records survive with the email replaced by its salted fingerprint and an `erased` flag set. Newsletter subscribers live in Resend only (the `resend` adapter). The concrete Sanity surface is passed in as `SanityErasureClient`.

## Exports

- `SanityErasureClient` — the minimal Sanity surface the adapter needs: `findByEmail`, `pseudonymise`.
- `createSanityErasureAdapter(client, salt)` — returns the `ErasureAdapter` named `sanity` (`findByEmail`, `export`, `preview`, `anonymize`, `delete` no-op).

## Usage

```ts
import { createSanityErasureAdapter } from "@indiecrafts/api/erasure/sanity";
import { createRealSanityClient } from "@indiecrafts/api/erasure/sanity-client";

const adapter = createSanityErasureAdapter(
  createRealSanityClient(cfg),
  env.GDPR_FINGERPRINT_SALT,
);
```

## Source

`code/shared/api/src/erasure/sanity.ts`
