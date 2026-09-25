---
title: "Clerk auth port hook"
description: "Builds the Clerk-free AccountAuth seam from @clerk/nextjs for the account tabs, wrapping self-erasure in step-up reverification."
status: stable
---

# Clerk auth port hook

> The `AccountAuth` seam over Clerk — token access plus a reverification-wrapped self-erasure.

## Purpose

Builds the Clerk-free `AccountAuth` seam from `@clerk/nextjs` for the account tabs. The self-erasure POST (with an optional churn survey) is wrapped in `useReverification` for a client step-up modal and auto-retry; the retry mints a fresh token carrying the updated factor-verification age. After a done or partial erasure, the seam signs the user out and returns home.

## Exports

- `callErasureSelf(apiUrl, getToken, email, survey, doRawErasureFetch?)` — the raw call `useReverification` wraps; the fetch is injectable so it is testable without mocking React or Clerk.
- `useClerkAuthPort(apiUrl)` — the hook that returns the `AccountAuth` seam (`getToken`, `submitErasure`, `onDeleted`).

## Usage

```ts
import { useClerkAuthPort } from "@indiecrafts/packages-web-auth/account/use-clerk-auth-port";

const auth = useClerkAuthPort(apiUrl);
await auth.submitErasure(email, survey);
```

## Source

`code/packages/web/auth/src/account/use-clerk-auth-port.ts`
