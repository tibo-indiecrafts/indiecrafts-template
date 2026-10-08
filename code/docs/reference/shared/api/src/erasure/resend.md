---
title: "Resend erasure adapter"
description: "Exports and deletes the subject's Resend contact."
status: stable
---

# Resend erasure adapter

> Exports the data subject's Resend contact and deletes it — a 404 counts as done.

## Purpose

Implements the compliance `ErasureAdapter` for Resend. Resend is the newsletter's only list and mirrors marketing consent: the email, the global flag, topic flags, the `locale` property and the language segments. So erasure is deletion, like `clerk`. `delete` always calls `deleteResendContact`; a 404 (no contact) is success, and another error throws so the engine records it in the receipt.

`export` reads the contact for a DSAR bundle: `{ email, unsubscribed, created_at, properties, topics, segments }` (segment names). It is best-effort: a 404 or any error gives `null`, never a throw. `findByEmail` and `preview` make no Resend call: the engine does not read them to decide. `buildErasureAdapters` adds this adapter only when `RESEND_API_KEY` is set. Self-erasure and the Clerk `user.deleted` webhook exclude it: they suppress (churn win-back) or delete the contact themselves.

## Exports

- `createResendErasureAdapter(env, doFetch?)` — returns the `ErasureAdapter` named `resend` (`export` reads the contact, `delete` removes it; the other methods are no-ops).

## Usage

```ts
import { createResendErasureAdapter } from "./erasure/resend";

const adapter = createResendErasureAdapter(env);
```

## Source

`code/shared/api/src/erasure/resend.ts`
