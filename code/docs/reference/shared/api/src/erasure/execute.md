---
title: "Erasure execution"
description: "Runs a verified erasure end to end — engine, Clerk retry, row update, audit and completion email."
status: stable
---

# Erasure execution

> The one path every erasure takes once the subject's email is verified.

## Purpose

Shared by the public confirm route and the admin retry. The caller owns the checks (token, attempts, fingerprint, admin bearer); this runs a dry-run then the live `runErasure` pass, retries a failed Clerk delete once inline, and records the outcome on the request row (`completed`, or stays `confirmed` while any store still fails). The `erasure.completed` audit row and the completion email go out only when the Clerk delete succeeded — never a false "erasure complete" while the account is still live. Both are best-effort after the row is committed.

## Exports

- `executeErasure(env, row, email, deps, country)` — returns `{ status, clerkFailed, errors }`.
- `defaultExecuteDeps` — the real adapters and email sender; tests inject mocks.
- Types `ErasureRow`, `ExecuteDeps`, `ExecuteResult`.

## Source

`code/shared/api/src/erasure/execute.ts`
