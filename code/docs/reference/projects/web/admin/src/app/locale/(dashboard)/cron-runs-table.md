---
title: "Cron runs table"
description: "Client component that renders cron health, live erasure/export counts, and the recent runs with per-pass results."
status: stable
---

# Cron runs table

> The body of the admin "Scheduled jobs" page.

## Purpose

Renders the cron health badge, the last run time, and the live counts (erasure requests open, due soon, deadline passed; exports awaiting download, expired but not deleted — a non-zero alarm count is a destructive badge). Below, the last 24 runs, each with one badge per pass (`audit_purge` · `main_purge` · `erasure_sla` · `export_cleanup`) and its counts, error name or skip reason. Every badge carries text, never color alone.

## Exports

- `CronRunsTable({ status })` — `status` is the `GET /v1/cron/status` payload, or `null` when unreachable.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/cron-runs-table.tsx`
