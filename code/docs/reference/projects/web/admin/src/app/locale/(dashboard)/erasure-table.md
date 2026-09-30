---
title: "Erasure requests table"
description: "Client component that lists open GDPR erasure requests by deadline and the recently closed ones."
status: stable
---

# Erasure requests table

> The body of the admin "Erasure requests" page.

## Purpose

Two tables: open requests (soonest deadline first) and recently closed ones. Each row shows the id, status, request and due dates, a deadline badge (deadline passed · due soon · on track · closed) and when the cron flagged it. No identifiers — the erasure engine does the work; this view watches the one-month deadline. Shows an "API unreachable" line when the payload is `null`.

## Exports

- `ErasureTable({ data })` — `data` is the `GET /v1/erasure-requests` payload, or `null`.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/erasure-table.tsx`
