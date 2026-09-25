---
title: "System health page"
description: "Admin route that probes each surface, worker, and database and shows a live/down status dashboard."
status: stable
---

# System health page

> The admin screen for deployment health across surfaces, workers, and databases.

## Purpose

This is the `/system` segment of the admin dashboard. It probes each configured surface's `/api/version` endpoint and each HTTP worker's `/health` endpoint server-side, then reports version, commit, and a live/down/not-configured `Badge`. Non-HTTP workers (cron, workers) and databases (D1, Sanity) get their own status rows. URLs come from server-only env; unset surfaces render "not configured".

## Exports

- `default` — `SystemPage`, an async server component for the admin `/system` route. Not imported by other code; Next.js renders it for the segment.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/system/page.tsx`
