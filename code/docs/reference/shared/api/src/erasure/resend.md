---
title: "Resend erasure adapter"
description: "Deletes the subject's Resend contact during erasure."
status: stable
---

# Resend erasure adapter

> Deletes the data subject's Resend contact — a 404 counts as done.

## Purpose

Implements the compliance `ErasureAdapter` for Resend. Resend holds a mirror of our own consent records (newsletter subscribers, marketing consent): the email plus topic flags. So erasure is deletion, like `clerk`. `delete` always calls `deleteResendContact`; a 404 (no contact) is success, and another error throws so the engine records it in the receipt.

`findByEmail`, `export` and `preview` make no Resend call: the engine does not read them to decide, and the data is already exported from D1 and Sanity. `buildErasureAdapters` adds this adapter only when `RESEND_API_KEY` is set. Self-erasure and the Clerk `user.deleted` webhook exclude it: they suppress (churn win-back) or delete the contact themselves.

## Exports

- `createResendErasureAdapter(env, doFetch?)` — returns the `ErasureAdapter` named `resend` (`delete` removes the contact; the other methods are no-ops).

## Usage

```ts
import { createResendErasureAdapter } from "./erasure/resend";

const adapter = createResendErasureAdapter(env);
```

## Source

`code/shared/api/src/erasure/resend.ts`
