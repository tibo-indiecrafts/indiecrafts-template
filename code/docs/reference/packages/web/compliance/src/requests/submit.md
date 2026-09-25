---
title: "Data-request submit"
description: "Server-only write path for the public data-subject request form."
status: stable
---

# Data-request submit

> Validate, store the legal record, then best-effort alert the owner.

## Purpose

The single runtime write path for the public data-request form. It validates the input, then POSTs a bearer-authed request to the api worker's `POST /v1/data-request` (D1) — the legal record the team actions. On a stored request, one best-effort owner alert may fire; a mail failure never turns a saved request into a 500. A honeypot field is treated as spam and dropped while still returning success, so bots learn nothing. It is `server-only`.

## Exports

- `submitDataRequest(input, submittedAt, policyVersion?)` — validates, stores, and alerts; returns a `DataRequestResult`.
- `validateDataRequest` — re-exported from `validate.ts`.
- `DataRequestInput`, `DataRequestResult` — re-exported types.

## Usage

```ts
import { submitDataRequest } from "@indiecrafts/packages-web-compliance/requests/submit";

const result = await submitDataRequest(
  input,
  new Date().toISOString(),
  policyVersion,
);
```

## Source

`code/packages/web/compliance/src/requests/submit.ts`
