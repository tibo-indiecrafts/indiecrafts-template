---
title: "Monitoring server actions"
description: "Admin server actions that retry an erasure, close one by hand, and run the cron now — re-authorized and audited."
status: stable
---

# Monitoring server actions

> The admin's write actions for erasure requests and the cron.

## Purpose

Each action re-checks the admin role on the server (never trusted from the client), calls a bearer-gated api route with the server-side token, and writes an admin audit event (`admin.erasure_retry` / `admin.erasure_close` with target `erasure:<id>`, `admin.cron_run` with target `cron`). They return `{ ok: true, … }` or `{ ok: false, error }` and never throw to the client. A non-admin gets `forbidden` with no api call and no audit. Every authorized attempt is audited, whether or not the api answered — a lost response may still have acted.

## Exports

- `retryErasure(id, email?)` — `{ ok, outcome: completed | partial }` or an error such as `email_required`, `clerk_email_changed` or `changed`.
- `closeErasure(id, note)` — the note is required (5–500 characters).
- `runCronNow()` — `{ ok, status: ok | failed }` or `cron_unbound` / `cron_unreachable` / `unreachable`.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/monitoring-actions.ts`
