---
title: "Waitlist export"
description: "Exports waitlistEntry documents from Sanity to a timestamped CSV backup."
status: stable
---

# Waitlist export

> Read-only CSV export of the waitlist sign-ups.

## Purpose

Fetches every `waitlistEntry` document (newest first) from the dataset and writes `backups/waitlist/waitlist-<timestamp>.csv`. Read-only on the dataset. Each cell is escaped through `csvCell` to guard against CSV formula injection. Needs `SANITY_API_READ_TOKEN` (Viewer) or `SANITY_API_WRITE_TOKEN`.

## Exports

No public exports (CLI script).

## Usage

```bash
pnpm waitlist:export
```

## Source

`code/projects/web/surfaces/website/scripts/waitlist-export.mjs`
