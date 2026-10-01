---
title: "DSAR intake route"
description: "Write and read handlers for the GDPR data-subject-request form, backed by D1 with optional at-rest PII encryption."
status: stable
---

# DSAR intake route

> The data-subject-request form's D1-backed write and admin read paths.

## Purpose

Handles the GDPR Art. 15–21 request form, migrated off Sanity into the `main` D1. `handleDataRequestWrite` is called server-to-server by the website's guarded `/api/data-request` route; `handleDataRequestList` backs the admin screen. Operational PII (email + free-text message) is encrypted at rest with AES-256-GCM when `PII_ENCRYPTION_KEY` is set, and read back transparently for either encrypted or legacy plaintext rows.

## Exports

- `handleDataRequestWrite(request, env)` — bearer-gated POST; validates the request type and email, then inserts a `data_requests` row (encrypting the PII fields when a key is set). An unparseable `submittedAt` is replaced by now. Returns `201 { ok, id }` on success, then sends the receipt email (best-effort; `deps.sendReceipt` is injectable).
- `handleDataRequestList(request, env)` — bearer-gated GET; lists rows newest-first (limit clamped 1–200), decrypting the PII fields for the operator view; each row carries `due_at`.

## Usage

```ts
import {
  handleDataRequestWrite,
  handleDataRequestList,
} from "@indiecrafts/api/data-request/route";

// dispatched from the worker's fetch router
if (url.pathname === "/v1/data-request")
  return handleDataRequestWrite(request, env);
if (url.pathname === "/v1/data-requests")
  return handleDataRequestList(request, env);
```

## Source

`code/shared/api/src/data-request/route.ts`
