---
title: "Dataset audit"
description: "Read-only audit of the live Sanity dataset that surfaces missing language fields, broken references, legacy blocks, and stale drafts."
status: stable
---

# Dataset audit

> Reads the live Sanity dataset and reports content-integrity issues without changing anything.

## Purpose

This read-only CLI script audits the live Sanity dataset and reports integrity issues. It needs `NEXT_PUBLIC_SANITY_PROJECT_ID` and `SANITY_API_READ_TOKEN` (a viewer token; `SANITY_API_WRITE_TOKEN` also works). It exits non-zero when any issue is found, so it can gate CI.

It surfaces:

- Documents missing a required `language` field (`post`, `category`, `tag`, `quote`, `author`, `person`).
- Documents and post body blocks of removed types (`logo`, `form`, and their `module.*` equivalents).
- Posts with a missing or broken author, category, or tag reference.
- Published posts with no slug: the Studio requires one, so these came in through the API, and no page, feed, or sitemap can reach them.
- Drafts older than 30 days (a drift indicator).

## Exports

No public exports (CLI script).

## Usage

```bash
node --env-file=.env.local scripts/audit-dataset.mjs
# or:
pnpm dlx tsx scripts/audit-dataset.mjs
```

## Source

`code/projects/web/surfaces/website/scripts/audit-dataset.mjs`
