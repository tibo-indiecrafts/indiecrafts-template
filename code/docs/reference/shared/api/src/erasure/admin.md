---
title: "Admin erasure actions"
description: "Retry a stuck erasure request or close it by hand with a note — the handlers behind two bearer-gated admin routes."
status: stable
---

# Admin erasure actions

> What the admin can do about an erasure request the system can't finish on its own.

## Purpose

`POST /v1/erasure-requests/:id/retry` re-runs a `confirmed` (stuck) request through `executeErasure`. The subject's email comes from Clerk by the stored user id when that user still exists; only once the user is gone does the operator type it. Either way it must match the stored fingerprint, and it is never stored or logged. The Clerk delete finds the user by email, so a user who still exists under a changed email stops the retry (409 `clerk_email_changed`) — never a false "completed". A Clerk outage is 503 `clerk_unavailable`, never read as a deleted user. Responses: 200 completed · 207 partial · 502 Clerk still failing · 422 `email_required` · 400 `email_mismatch` · 409 `not_retryable` / `clerk_email_changed` / `changed` (the row changed during the run — a concurrent retry or a manual close; nothing recorded) · 503 `clerk_unavailable`. `POST /v1/erasure-requests/:id/close` closes an open request with a required note (5–500 characters): status `closed_manual`, and `manualClose: {note, by, at}` merged into the receipt. The admin server action re-checks the role and writes the admin audit event.

## Exports

- `handleErasureRetry(request, env, id, deps?)` — the retry handler; `deps.lookupEmail` is injectable.
- `handleErasureClose(request, env, id)` — the manual-close handler.
- `defaultRetryDeps`, type `RetryDeps`.

## Source

`code/shared/api/src/erasure/admin.ts`
