---
title: "Subscriber export"
description: "Exports the newsletter subscribers from Resend's language segments to a timestamped CSV backup."
status: stable
---

# Subscriber export

> Read-only CSV export of the newsletter subscribers, from Resend.

## Purpose

Resend is the newsletter's only list, with one `newsletter-<code>` segment per site language. The script pages through each segment (`GET /segments/{id}/contacts?limit=100&after=…`) and writes `backups/subscribers/subscribers-<timestamp>.csv` with the columns `email,locale,unsubscribed,created_at`. The `locale` comes from the segment name. By default it skips `unsubscribed` contacts; `--all` keeps them and writes `subscribers-all-<timestamp>.csv`, for an audit. Read-only on Resend; each cell goes through `csvCell` (CSV formula injection). Needs `RESEND_API_KEY`.

## Exports

- `FIELDS` — the CSV columns.
- `fetchSubscribers(key, { all?, doFetch? })` — the rows of every `newsletter-*` segment. Throws on a Resend error.
- `toCsv(fields, rows)` — the CSV text.

## Usage

```bash
pnpm export:web:website:subscribers          # newsletter subscribers
pnpm export:web:website:subscribers --all    # unsubscribed included (audit)
```

## Source

`code/projects/web/surfaces/website/scripts/subscribers-export.mjs`
