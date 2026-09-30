---
title: "apiFetch"
description: "fetch for calls into the api: a 10 s timeout and one safe retry with backoff and jitter."
status: stable
---

# apiFetch

> The caller side of the api's production contract.

## Purpose

Retries once on a network error, a timeout, a 5xx or a 429 (waiting `Retry-After` when it is 5 s or less, else 300–800 ms of jitter), never on another 4xx. A GET is always retryable. A POST is retried only when the caller passes `idempotent: true` — it then carries an `Idempotency-Key` generated once and kept across the retry; any other POST gets the timeout but no retry, because it could act twice. Headers are passed as a plain object. Used by the admin's api calls, the three event senders (`web/auth` session-log, `web/compliance` consent-log, `web/security-reports` forward, marked idempotent) and the export client (`shared/compliance` export-self — not idempotent: timeout only). The admin's long-running actions pass `timeoutMs: 60_000`.

## Exports

- `apiFetch(url, init?)` — `init` adds `timeoutMs` (default 10 000) and `idempotent`.
- Type `ApiFetchInit`.

## Source

`code/packages/shared/utils/src/api-fetch.ts`
