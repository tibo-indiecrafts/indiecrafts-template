---
title: "Admin monitoring payloads"
description: "Builds the GET /v1/cron/status and GET /v1/erasure-requests payloads — cron run health and open erasure requests by deadline."
status: stable
---

# Admin monitoring payloads

> The data behind the admin "Scheduled jobs" and "Erasure requests" pages.

## Purpose

Pure payload builders for two bearer-gated admin routes. `cronStatus` returns the last 24 `cron_runs` rows (audit D1), a `stale` flag (no run in the last 2 hours — the cron runs hourly), and live counts from the main D1: open, due-soon and breached erasure requests, outstanding and expired-unswept exports. `erasureRequests` lists open requests by deadline and the 20 most recently requested closed ones, each with a computed `state`. It selects an explicit column list, so no `email_fingerprint` or `user_id` ever leaves the api. "Open" means confirmed, or awaiting confirmation with a live link — the same definition as the cron's `erasure_sla` pass.

## Exports

- `STALE_AFTER_MS` — 2 hours, tied to the hourly cron trigger.
- `erasureState(status, dueAt, tokenExpiresAt, nowIso, dueSoonIso)` — `breached` · `dueSoon` · `onTrack` · `closed`.
- `cronStatus(env, now, warnDays)` — the `GET /v1/cron/status` body.
- `erasureRequests(env, now, warnDays)` — the `GET /v1/erasure-requests` body.

## Source

`code/shared/api/src/monitoring.ts`
