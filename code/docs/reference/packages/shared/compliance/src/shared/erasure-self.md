---
title: "Account erasure client"
description: "The client-side authenticated POST to the erasure worker route, plus its status mapping."
status: stable
---

# Account erasure client

> One erasure POST, wrappable by Clerk step-up, mapped to a plain result.

## Purpose

The client half of self-service account erasure. It POSTs to the api erasure route and maps the response to a small result union. The raw fetch is separated so a surface can wrap it in Clerk `useReverification` for a step-up modal while the brick stays Clerk-free.

## Exports

- `ErasureSelfResult` (type) — `"done" | "partial" | "mismatch" | "error"`.
- `ErasureFetchOutcome` (type) — `{ status }` on a normal outcome, or Clerk's `{ clerk_error }` hint body on a 403.
- `ChurnSurveyInput` (interface) — optional churn fields (`reason` / `feedback` / `competitor`) sent with the POST.
- `rawErasureFetch` — the one authenticated erasure POST; returns a plain outcome; `doFetch` is injectable for tests.
- `mapErasureResponse` — maps an outcome to `ErasureSelfResult`.
- `submitAccountErasure` — the default (no step-up) submit path.

## Usage

```ts
import { submitAccountErasure } from "@indiecrafts/packages-shared-compliance/shared";

const result = await submitAccountErasure({
  apiUrl,
  getToken,
  email: "user@example.com",
  reason: "too_expensive",
});
// result: "done" | "partial" | "mismatch" | "error"
```

## Source

`code/packages/shared/compliance/src/shared/erasure-self.ts`
