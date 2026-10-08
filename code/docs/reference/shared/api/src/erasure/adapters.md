---
title: "Erasure adapter assembly"
description: "Builds the set of real erasure adapters from env secrets, gating Clerk and Sanity by configuration."
status: stable
---

# Erasure adapter assembly

> One home for the erasure adapter set used by every erasure path.

## Purpose

Assembles the real erasure adapters from `env` secrets. It is the single place that builds the adapter list shared by `confirm.ts`, `self.ts`, and the Clerk `user.deleted` webhook. The `clerk` adapter is included only when `includeClerk !== false` and `CLERK_SECRET_KEY` is set; the `sanity` adapter only when its project, dataset, and write-token secrets are all present; the `resend` adapter only when `RESEND_API_KEY` is set and `includeResend !== false`.

## Exports

- `ErasureAdapterOpts` — `{ includeClerk?, includeResend? }`.
- `buildErasureAdapters(env, opts?)` — returns the `ErasureAdapter[]` (`d1-core`, `d1-audit`, optional `clerk`, optional `sanity`, optional `resend`, and the `orders` stub). Pass `{ includeClerk: false }` on the webhook path, where the Clerk user is already deleted. Self-erasure and the Clerk webhook pass `{ includeResend: false }`: they suppress or delete the Resend contact themselves, and a churn keeps a suppressed contact for win-back.

## Usage

```ts
import { buildErasureAdapters } from "@indiecrafts/api/erasure/adapters";

const adapters = buildErasureAdapters(env);
const webhookAdapters = buildErasureAdapters(env, { includeClerk: false });
```

## Source

`code/shared/api/src/erasure/adapters.ts`
