---
title: "Comment export"
description: "Exports blog comment documents from Sanity to a timestamped CSV backup."
status: stable
---

# Comment export

> Read-only CSV export of the blog comments.

## Purpose

Fetches every `comment` document (newest first, with the linked post title resolved) and writes `backups/comments/comments-<timestamp>.csv`. Read-only on the dataset. Each cell is escaped through `csvCell` to guard against CSV formula injection. Needs `SANITY_API_READ_TOKEN` (Viewer) or `SANITY_API_WRITE_TOKEN`.

## Exports

No public exports (CLI script).

## Usage

```bash
pnpm comments:export
```

## Source

`code/projects/web/surfaces/website/scripts/comments-export.mjs`
