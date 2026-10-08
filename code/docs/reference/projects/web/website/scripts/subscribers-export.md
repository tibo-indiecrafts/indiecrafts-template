---
title: "Subscriber export"
description: "Exports newsletter subscriber documents from Sanity to a timestamped CSV backup."
status: stable
---

# Subscriber export

> Read-only CSV export of the newsletter subscribers.

## Purpose

Writes the newsletter subscribers to `backups/subscribers/subscribers-<timestamp>.csv`, newest first. By default only the people the newsletter may be sent to: `status == "confirmed"` and newsletter consent (`coalesce(newsletter, source != "lead-magnet")` — a lead-magnet-only sign-up consented to its document, not the newsletter). `--all` writes `subscribers-all-<timestamp>.csv` with every doc and its `status`, `newsletter` and `consent`, for an audit. Read-only on the dataset; each cell goes through `csvCell` (CSV formula injection). Needs `SANITY_API_READ_TOKEN` (Viewer) or `SANITY_API_WRITE_TOKEN`.

## Exports

- `exportQuery(all)` — the GROQ query and its columns.
- `toCsv(fields, rows)` — the CSV text.

## Usage

```bash
pnpm export:web:website:subscribers          # confirmed newsletter subscribers
pnpm export:web:website:subscribers --all    # every doc (audit)
```

## Source

`code/projects/web/surfaces/website/scripts/subscribers-export.mjs`
