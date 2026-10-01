---
title: "Data requests table"
description: "Read-only component that renders GDPR data-subject-request rows as a shadcn table."
status: stable
---

# Data requests table

> The table that renders GDPR data-subject requests for the admin.

## Purpose

A component used by the admin data-requests page (next-intl `useTranslations` + `useFormatter`, so it renders on the server). It renders the request rows in a shadcn `Table`: the date in UTC, the right and the status as localized words (an unknown key shows raw), the email as a `mailto:` reply link, and the message as an 80-character excerpt that opens (`<details>`) to the full text. The row type `DataRequestRow` lives in `@/lib/monitoring`.

## Exports

- `DataRequestsTable` — takes `rows: DataRequestRow[]` and renders the table.

## Usage

```tsx
import { fetchDataRequests } from "@/lib/monitoring";
import { DataRequestsTable } from "../data-requests-table";

const rows = await fetchDataRequests(); // null = could not load
return rows?.length ? <DataRequestsTable rows={rows} /> : null;
```

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/data-requests-table.tsx`
