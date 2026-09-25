---
title: "Backups table"
description: "Client component that renders the backup bucket summary and a recent-runs table with a failure flag."
status: stable
---

# Backups table

> Read-only backup status, with a failure flag shown by icon and text.

## Purpose

Renders the backup bucket, retention, and pre-migration-snapshot summary plus the recent-runs table, sorted newest-first. A run is flagged when `status === "failed"` or it never finished (`finishedAt == null`); the flag pairs a warning icon with a text label, so it is never conveyed by color alone. Byte sizes are formatted to human-readable units.

## Exports

- `BackupsTable` — the table component; takes a `status` object.
- `BackupsStatus` — the full status shape (bucket, retention, flag, and runs).
- `BackupRun` — one run row, mirroring the shared api's `/v1/backups/status` response.

## Usage

```tsx
import { BackupsTable, type BackupsStatus } from "../backups-table";

<BackupsTable status={status} />;
```

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/backups-table.tsx`
