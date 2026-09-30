---
title: "API idempotency"
description: "Idempotency-Key replay for retried POST /v1/events and POST /v1/export, stored 24 h."
status: stable
---

# API idempotency

> Makes a retried append safe: the same key replays the stored answer.

## Purpose

Applies to `POST /v1/events` and `POST /v1/export` only (the other writes are idempotent by key). The key (1–255 printable characters) is reserved in `idempotency_keys` (audit D1, migration `0005`) under a scope of route + sha256 of the `authorization` header, so a key never replays another caller's answer. A retry with the same body replays the stored status and body (`Idempotent-Replayed: true`); another body is `422 idempotency_key_reused`; a key whose first request still runs is `409 idempotency_in_progress`; an invalid key is `400`. A 5xx, 429 or throw releases the key so the retry runs again. The cron's `audit_purge` deletes rows older than 24 h.

## Exports

- `withIdempotency(request, env, handler)` — wraps the router in the default `fetch`.

## Source

`code/shared/api/src/idempotency.ts`
