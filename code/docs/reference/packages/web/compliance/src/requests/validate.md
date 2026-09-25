---
title: "Data-request validation"
description: "Pure validation and spam heuristics for the data-subject request form."
status: stable
---

# Data-request validation

> No Sanity or email graph, so it unit-tests without env.

## Purpose

Pure validation for the data-subject request form. It checks the email, the request type, and the required processing consent, and applies two spam heuristics: a honeypot field that must be empty and a too-fast submit guard. The too-fast check is skew-safe, so a client clock running ahead never false-flags a real person. `submit.ts` imports these; the API route calls `submitDataRequest`, never this directly.

## Exports

- `DataRequestInput` — the input shape for one request.
- `DataRequestResult` — `{ ok: true }` or `{ ok: false; error: "invalid" | "spam" | "server" }`.
- `tooFast(startedAt?)` — true when the submit came in under the human threshold.
- `validateDataRequest(input)` — the pure validator.

## Usage

```ts
import { validateDataRequest } from "@indiecrafts/packages-web-compliance/requests/validate";

const result = validateDataRequest(input);
if (!result.ok) {
  // result.error is "invalid" | "spam" | "server"
}
```

## Source

`code/packages/web/compliance/src/requests/validate.ts`
