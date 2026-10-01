---
title: "Data-request detail and status"
description: "Reads one GDPR data request with its history, and moves it through its statuses."
status: stable
---

# Data-request detail and status

> The operator side of a data-subject request: read it, then move it.

## Purpose

Backs the admin side sheet. Both routes are bearer-gated (`APP_API_TOKEN`).

- `GET /v1/data-requests/:id` returns the request (email and message decrypted), its `due_at`, and its history from `data_request_events`, newest first. Unknown id → `404 not_found`.
- `POST /v1/data-requests/:id/status` takes `{ status, from, note?, notify?, by }`. Allowed moves: `new` → `in-progress` | `done` | `rejected`; `in-progress` → `done` | `rejected`; a closed request has none. `from` is the status the operator saw: a different current status → `409 changed`. A move outside the table → `409 not_allowed`. Closing with `notify` needs a note (`400 note_required`) and emails it to the requester in the request's locale; a mail failure keeps the change and answers `notified: false`. Each move writes one event (note encrypted when `PII_ENCRYPTION_KEY` is set).

The due date is one calendar month after receipt (GDPR Art. 12(3)); a day the next month lacks becomes its last day (31 Jan → 28 Feb).

## Exports

- `dueAt(submittedAt)` — the ISO due date.
- `handleDataRequestDetail(request, env, id)`.
- `handleDataRequestStatus(request, env, id, deps?)` — `deps.sendClosed` is injectable for tests.

## Source

`code/shared/api/src/data-request/status.ts`
