---
title: "Erasure confirmation route"
description: "GET renders the confirm form; POST verifies the token, typed email, TTL, and attempt cap, then runs the erasure engine live."
status: stable
---

# Erasure confirmation route

> The public confirm step that verifies a mailed token and erases the subject's data.

## Purpose

Handles `/v1/erasure/confirm`. GET renders a read-only confirm form (never mutates, which defeats link and prefetch scanners). POST verifies the hashed token, the typed email against the stored fingerprint, the TTL, and a per-token attempt cap, then runs the erasure engine live against real Clerk, Sanity, and D1. It is single-use: only a row in status `email_sent` can be confirmed. A failed Clerk delete is retried once inline and, if it still fails, returns 502 with `clerk_failed: true` — never a false "erasure complete".

## Exports

- `handleErasureConfirm(request, env, ctx?, buildAdapters?, send?)` — the route handler. `buildAdapters` and `send` are injectable for tests; production omits them.

## Usage

```ts
import { handleErasureConfirm } from "@indiecrafts/api/erasure/confirm";

if (url.pathname === "/v1/erasure/confirm")
  return handleErasureConfirm(request, env, ctx);
```

## Source

`code/shared/api/src/erasure/confirm.ts`
