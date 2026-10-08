---
title: "Subscriber export"
description: "Exports the newsletter subscribers from Resend's language segments to a timestamped CSV backup."
status: stable
---

# Subscriber export

> Read-only CSV export of the newsletter subscribers, from Resend.

## Purpose

Resend is the newsletter's only list, with one `newsletter-<code>` segment per site language. The script finds the `News` topic, pages through each segment (`GET /segments/{id}/contacts?limit=100&after=…`), reads each contact's topics, and writes `backups/subscribers/subscribers-<timestamp>.csv` with the columns `email,locale,news,unsubscribed,created_at`. The `locale` comes from the segment name; `news` is the contact's `News` topic subscription. By default it keeps only contacts opted into `News` and not globally unsubscribed — someone who left the topic from Resend's preference page stays in their segment but is never exported; `--all` keeps everyone and writes `subscribers-all-<timestamp>.csv`, for an audit. A `429` is retried (Resend's low rate limit). Read-only on Resend; each cell goes through `csvCell` (CSV formula injection). Needs `RESEND_API_KEY`.

## Exports

- `FIELDS` — the CSV columns.
- `fetchSubscribers(key, { all?, doFetch?, sleep? })` — the rows of every `newsletter-*` segment. Throws on a Resend error, or when the `News` topic is missing (run `pnpm resend:topics:sync`).
- `toCsv(fields, rows)` — the CSV text.

## Usage

```bash
pnpm export:web:website:subscribers          # newsletter subscribers
pnpm export:web:website:subscribers --all    # opted-out included (audit)
```

## Source

`code/projects/web/surfaces/website/scripts/subscribers-export.mjs`
