---
title: "Account auth port"
description: "The per-surface Clerk seam for the account 'Your data' tab."
status: stable
---

# Account auth port

> The Clerk seam that keeps the account-data components SDK-free.

## Purpose

Defines the per-surface Clerk seam for the account "Your data" tab. Each surface builds this from its own Clerk SDK, so this brick and its tab components stay `@clerk/*`-free.

## Exports

- `AccountAuth` — the port interface with three members:
  - `getToken` — a fresh Clerk session token for the authenticated export and erasure calls.
  - `submitErasure(email, survey?)` — the erasure POST (plus optional churn survey), wrapped in the SDK's re-verification and mapped to an `ErasureSelfResult`.
  - `onDeleted` — runs after a done or partial erasure: sign out and route home.
  - `submitExport()` (optional) — the data export wrapped in the SDK's re-verification and mapped to an `ExportResult`.

## Usage

```ts
import type { AccountAuth } from "@indiecrafts/packages-shared-compliance/shared";

const auth: AccountAuth = { getToken, submitErasure, onDeleted };
```

## Source

`code/packages/shared/compliance/src/shared/account-port.ts`
