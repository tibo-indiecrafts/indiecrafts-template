---
title: "API idempotency"
description: "Idempotency-Key replay for retried POST /v1/events, stored 24 h."
status: stable
---

# API idempotency

> Makes a retried append safe: the same key replays the stored answer.

## Purpose

Applies to `POST /v1/events` only; `/v1/export` is deliberately not covered (its answer is a live download link). A key is reserved only for a caller holding the server bearer with a body inside the 4 KB cap, so an unauthenticated request never writes here. The key (1–255 printable characters) is reserved in `idempotency_keys` (audit D1, migration `0005`) under a scope of route + sha256 of the `authorization` header, so a key never replays another caller's answer. A retry with the same body replays the stored status and body (`Idempotent-Replayed: true`); another body is `422 idempotency_key_reused`; a key still running is `409 idempotency_in_progress`, unless it has been unfinished for 30 s — then the retry takes it over atomically. A 5xx, 429 or throw releases the key. The row holds hashes and the `{ ok }` answer only. The cron's `audit_purge` deletes rows older than 24 h.

## Exports

- `withIdempotency(request, env, handler)` — wraps the router in the default `fetch`.

## Source

`code/shared/api/src/idempotency.ts`
