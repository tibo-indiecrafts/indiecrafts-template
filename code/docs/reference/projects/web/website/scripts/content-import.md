---
title: "Dataset restore"
description: "Imports a Sanity dataset backup, overwriting documents with matching ids in the target dataset."
status: stable
---

# Dataset restore

> Restores a Sanity dataset backup — the CMS analog of a database restore.

## Purpose

Restores a `.tar.gz` dataset export into a Sanity dataset via `sanity dataset import --replace`. Destructive: `--replace` overwrites documents that share an `_id` in the target dataset. Prompts for a typed confirmation of the dataset name unless `--yes` is passed. `--dataset X` targets a specific dataset instead of `NEXT_PUBLIC_SANITY_DATASET`. Needs `SANITY_API_WRITE_TOKEN` (Editor) — prefer importing into a scratch dataset first.

## Exports

No public exports (CLI script).

## Usage

```bash
pnpm db:restore:content -- <file.tar.gz>              # into the default dataset
pnpm db:restore:content -- <file.tar.gz> --dataset X  # into a specific dataset
pnpm db:restore:content -- <file.tar.gz> --yes        # skip the confirmation
```

## Source

`code/projects/web/surfaces/website/scripts/content-import.mjs`
