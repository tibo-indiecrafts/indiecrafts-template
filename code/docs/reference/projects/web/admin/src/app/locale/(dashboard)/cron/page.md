---
title: "Scheduled jobs page"
description: "Admin route that shows cron health and recent runs from GET /v1/cron/status."
status: stable
---

# Scheduled jobs page

> The admin dashboard's cron monitoring route.

## Purpose

Reads `GET /v1/cron/status` server-side (the token never reaches the browser) and renders it through `CronRunsTable`. Display only — no control here.

## Exports

- `default` — `CronPage`, the route segment component for `/[locale]/cron`.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/cron/page.tsx`
