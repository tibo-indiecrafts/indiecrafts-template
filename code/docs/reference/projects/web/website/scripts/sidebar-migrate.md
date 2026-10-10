---
title: "Sidebar migration"
description: "One-time update of an existing dataset for the block sidebar and the blog blocks on pages."
status: stable
---

# Sidebar migration

> Brings an existing dataset to the block sidebar in one transaction.

## Purpose

One-time update of an existing dataset. New datasets get the same documents from the seed. The script does three writes:

- It creates `sidebarSettings-<locale>` when it is missing. The locales are the ones with default copy in `HOME_FEATURED_COPY`, plus the languages of the home pages it finds. Articles keep the TOC and related posts they had before the sidebar became configurable. A card stays off when the editor had turned it off: `blog.display.post.tableOfContents` or `relatedPosts` was `false`.
- It appends the "Articles à la une" block to each home `page` (published and draft) that has no `module.blog-featured`. This block replaces the strip the home rendered in code. A home page in a locale with no copy is skipped, and the script reports it.
- It unsets `blog.display.post.tableOfContents`. The TOC is now a sidebar card.

The script runs as a dry run by default and prints the plan. `--apply` writes the plan in one transaction. Each step skips work that is done, so a re-run is safe. It reads drafts too (`perspective: "raw"`). It needs `NEXT_PUBLIC_SANITY_PROJECT_ID` and `SANITY_API_WRITE_TOKEN` (Editor role). `--dataset` overrides `NEXT_PUBLIC_SANITY_DATASET`.

## Exports

- `planSidebarMigration(docs, newKey?)` — pure. Returns `{ creates, homes, blogs, skipped }`: the settings to create, the home pages to append to, the `blog` ids to unset, and the home page ids with no copy for their locale.

## Usage

```bash
node --env-file=.env.local scripts/sidebar-migrate.mjs                            # dry run
node --env-file=.env.local scripts/sidebar-migrate.mjs --apply                    # write
node --env-file=.env.local scripts/sidebar-migrate.mjs --dataset tests-e2e --apply
```

## Source

`code/projects/web/surfaces/website/scripts/sidebar-migrate.mjs`
