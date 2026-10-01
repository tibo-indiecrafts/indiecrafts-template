---
title: "Data requests page"
description: "Admin route that reads recent GDPR data-subject requests from the shared api and renders them read-only."
status: stable
---

# Data requests page

> The admin screen for reviewing GDPR data-subject requests.

## Purpose

This is the `/data-requests` segment of the admin dashboard. It fetches the newest 100 data-subject requests server-side with `fetchDataRequests` (`@/lib/monitoring`; the token stays on the server), then renders them through `DataRequestsTable`. A failed read shows an error alert, never "no requests". The view is read-only; status changes are done by hand with `wrangler d1 execute` until write-back lands.

## Exports

- `default` — `DataRequestsPage`, an async server component for the admin `/data-requests` route. Not imported by other code; Next.js renders it for the segment.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/data-requests/page.tsx`
