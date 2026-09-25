---
title: "Contact message export"
description: "Exports contactMessage documents from Sanity to a timestamped CSV backup."
status: stable
---

# Contact message export

> Read-only CSV export of the contact-form submissions.

## Purpose

Fetches every `contactMessage` document (newest first) from the dataset and writes `backups/contact/contact-<timestamp>.csv`. Read-only on the dataset. Each cell is escaped through `csvCell` so a value like `=HYPERLINK(...)` cannot execute in a spreadsheet. Needs `SANITY_API_READ_TOKEN` (Viewer) or `SANITY_API_WRITE_TOKEN`.

## Exports

No public exports (CLI script).

## Usage

```bash
pnpm contact:export
```

## Source

`code/projects/web/surfaces/website/scripts/contact-export.mjs`
