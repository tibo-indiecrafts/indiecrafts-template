---
title: "Subscriber export"
description: "Exports newsletter subscriber documents from Sanity to a timestamped CSV backup."
status: stable
---

# Subscriber export

> Read-only CSV export of the newsletter subscribers.

## Purpose

Fetches every `subscriber` document (newest first) from the dataset and writes `backups/subscribers/subscribers-<timestamp>.csv`. Read-only on the dataset. Each cell is escaped through `csvCell` to guard against CSV formula injection. Needs `SANITY_API_READ_TOKEN` (Viewer) or `SANITY_API_WRITE_TOKEN`.

## Exports

No public exports (CLI script).

## Usage

```bash
pnpm export:web:website:subscribers
```

## Source

`code/projects/web/surfaces/website/scripts/subscribers-export.mjs`
