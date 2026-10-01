---
title: "Data-request shared helpers"
description: "The JSON reply, bearer, PII field encryption and GDPR due date shared by the data-request routes."
status: stable
---

# Data-request shared helpers

> A leaf module: the routes and emails import from here, never from each other.

## Purpose

Holds what `route.ts`, `status.ts` and `email.ts` all need, so no two of them import each other. `encField` / `decField` add optional field-level AES-256-GCM (with `PII_ENCRYPTION_KEY`) to the operational PII in `data_requests` and `data_request_events`; unset → plaintext, and the read path decrypts both forms without throwing. `dueAt` is one calendar month after receipt (GDPR Art. 12(3)); a day the next month lacks becomes its last day (31 Jan → 28 Feb).

## Exports

- `json(body, status, cors)` · `bearerOf(request)`.
- `encField(value, key)` · `decField(value, key)`.
- `dueAt(submittedAt)` — the ISO due date.

## Source

`code/shared/api/src/data-request/shared.ts`
