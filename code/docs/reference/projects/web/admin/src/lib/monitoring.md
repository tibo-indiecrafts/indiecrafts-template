---
title: "Admin monitoring client"
description: "Server-side fetchers for the api's monitoring routes and the cron health badge logic."
status: stable
---

# Admin monitoring client

> Reads the api's monitoring payloads with the server-side token.

## Purpose

Server-only helpers for the admin "Scheduled jobs", "Erasure requests", "Data requests" and System pages. The fetchers call the api with `APP_API_TOKEN` (never sent to the browser) and return `null` when the api is unconfigured or unreachable, so a page shows that state instead of crashing. `cronHealth` reduces a status to one badge; stale wins over failed, because an old failure means the cron stopped.

## Exports

- Types — `PassResult`, `CronRun`, `CronStatus`, `ErasureRow`, `ErasureRequests`, `CronHealth`, `DataRequestRow`.
- `cronHealth(status)` — `unreachable` · `never` · `stale` · `failed` · `ok`.
- `healthVariant(health)` — the `Badge` variant for a health state.
- `fetchCronStatus()` · `fetchErasureRequests()` · `fetchDataRequests()` — the api reads (through `apiFetch`: timeout + one retry). `fetchDataRequests` returns the newest 100 rows, or `null` when it cannot load — never an empty list.
- `apiHealthView(body?)` — the api's authed `/health` flattened for System: version, commit, both D1s, the bindings (dashes and empty lists when there is no body).

## Source

`code/projects/web/surfaces/admin/src/lib/monitoring.ts`
