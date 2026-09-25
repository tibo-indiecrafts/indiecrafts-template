---
title: "Churn page"
description: "Admin route that fetches churn aggregates from the shared api and renders reason, day, and feedback tables."
status: stable
---

# Churn page

> The admin dashboard's churn analytics route.

## Purpose

The admin churn route. It reads the churn aggregate (total, by-day, by-reason, and recent free-text feedback) from the shared api, which holds the API token server-side. It renders the total plus reason, day, and recent-feedback tables. Reason codes are mapped to localized labels; any unknown or unlisted code (including `null`) reads as "unknown". When the aggregate cannot be loaded (unconfigured or the api errored), it shows an alert instead.

## Exports

- `default` — `ChurnPage`, the Next.js route segment component for `/[locale]/churn`.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/churn/page.tsx`
