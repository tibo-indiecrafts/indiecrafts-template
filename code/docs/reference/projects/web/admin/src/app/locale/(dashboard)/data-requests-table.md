---
title: "Data requests table"
description: "Read-only server component that renders GDPR data-subject-request rows as a shadcn table."
status: stable
---

# Data requests table

> The table that renders GDPR data-subject requests for the admin.

## Purpose

An async server component used by the admin data-requests page. It renders the request rows in a shadcn `Table`, with a status `Badge` and an 80-character excerpt of each free-text `message` (never rendered raw). The row shape mirrors the api's `data_requests` schema.

## Exports

- `DataRequestRow` — the row type: `id`, `request_type`, `email`, `message`, `status`, `submitted_at`, `source`, `locale`.
- `DataRequestsTable` — async server component; takes `rows: DataRequestRow[]` and renders the table.

## Usage

```tsx
import { DataRequestsTable, type DataRequestRow } from "../data-requests-table";

const rows: DataRequestRow[] = await fetchDataRequests();
return <DataRequestsTable rows={rows} />;
```

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/data-requests-table.tsx`
