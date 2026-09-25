---
title: "Erasure submit helpers"
description: "Pure, testable POST helpers for the public erasure request and confirm worker routes."
status: stable
---

# Erasure submit helpers

> The two pure functions that POST to the public erasure worker routes and map HTTP status to a result string.

## Purpose

Pure helpers in `src/user-interface/erasure`, split from the forms so the network mapping is testable in isolation. `submitErasureRequest` sends form-encoded data to `POST /v1/erasure/request` (the worker reads `request.formData()`); the worker returns a generic 200 for well-formed input, so "sent" never confirms a match. `submitErasureConfirm` sends JSON to `POST /v1/erasure/confirm`. Each maps HTTP status codes to a small result union.

## Exports

- `submitErasureRequest(input)` — POSTs the request; resolves to `ErasureRequestResult`.
- `submitErasureConfirm(input)` — POSTs the confirmation; resolves to `ErasureConfirmResult`.
- `ErasureRequestResult` — `"sent" | "turnstile" | "error"`.
- `ErasureConfirmResult` — `"done" | "partial" | "mismatch" | "expired" | "error"`.

## Usage

```ts
import { submitErasureRequest } from "@/user-interface/erasure/submit";

const result = await submitErasureRequest({
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  email: "person@example.com",
  turnstileToken: token,
});
```

## Source

`code/projects/web/surfaces/website/src/user-interface/erasure/submit.ts`
