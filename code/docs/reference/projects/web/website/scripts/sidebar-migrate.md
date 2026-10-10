---
title: "Sidebar migration"
description: "One-time update of an existing dataset for the block sidebar and the blog blocks on pages."
status: stable
---

# Sidebar migration

> Brings an existing dataset to the block sidebar in one transaction.

## Purpose

One-time update of an existing dataset. New datasets get the same documents from the seed. The script does three writes:

- It creates `sidebarSettings-<locale>` when it is missing. Articles keep the TOC and related posts they had before the sidebar became configurable.
- It appends the "Articles à la une" block to each home `page` (published and draft) that has no `module.blog-featured`. This block replaces the strip the home rendered in code.
- It unsets `blog.display.post.tableOfContents`. The TOC is now a sidebar card.

The script runs as a dry run by default and prints the plan. `--apply` writes the plan in one transaction. Each step skips work that is done, so a re-run is safe. It reads drafts too (`perspective: "raw"`). It needs `NEXT_PUBLIC_SANITY_PROJECT_ID` and `SANITY_API_WRITE_TOKEN` (Editor role). `--dataset` overrides `NEXT_PUBLIC_SANITY_DATASET`.

## Exports

- `planSidebarMigration(docs, newKey?)` — pure. Returns `{ creates, homes, blogs }`: the settings to create, the home pages to append to, and the `blog` ids to unset.

## Usage

```bash
node --env-file=.env.local scripts/sidebar-migrate.mjs                            # dry run
node --env-file=.env.local scripts/sidebar-migrate.mjs --apply                    # write
node --env-file=.env.local scripts/sidebar-migrate.mjs --dataset tests-e2e --apply
```

## Source

`code/projects/web/surfaces/website/scripts/sidebar-migrate.mjs`
