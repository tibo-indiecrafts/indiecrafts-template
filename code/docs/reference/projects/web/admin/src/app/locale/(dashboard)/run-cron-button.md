---
title: "Run cron button"
description: "Client component that runs one cron tick on demand from the Scheduled jobs page."
status: stable
---

# Run cron button

> The "Run now" button on Scheduled jobs.

## Purpose

Calls `runCronNow()` — the api reaches the cron over a private service binding and runs the same four passes as the hourly trigger — then shows a toast (all OK, or a failed pass) and refreshes the page so the new run appears.

## Exports

- `RunCronButton()`.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/run-cron-button.tsx`
