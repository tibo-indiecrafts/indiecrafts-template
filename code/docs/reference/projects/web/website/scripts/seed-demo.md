---
title: "Demo content seeder"
description: "Seeds the Sanity dataset with translated demo blog content, SEO singletons, and site settings."
status: stable
---

# Demo content seeder

> Fills an empty Sanity dataset with a complete, translated demo site.

## Purpose

Seeds a Sanity dataset with a full EN/FR content set — authors, categories, tags, posts, quotes, people, and the `translation.metadata` links between them — plus the per-locale `siteMeta` SEO singletons, the `siteSettings` singleton, the home page-builder docs, and the `uiMessages` dictionaries. Idempotent: every document uses a fixed `_id` applied via `createOrReplace`, so re-running updates content in place instead of duplicating it. Used for local dev and to seed the throwaway `e2e` dataset.

## Exports

No public exports (CLI script).

## Usage

```bash
pnpm seed   # needs SANITY_API_WRITE_TOKEN (Editor role) in .env.local
```

## Source

`code/projects/web/surfaces/website/scripts/seed-demo.mjs`
