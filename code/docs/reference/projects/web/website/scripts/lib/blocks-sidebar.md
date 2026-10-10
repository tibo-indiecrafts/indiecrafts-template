---
title: "Block sidebar seed documents"
description: "Builds the home featured block and the per-locale sidebar settings for the seed and the sidebar migration."
status: stable
---

# Block sidebar seed documents

> The documents a dataset needs for the block sidebar and the home featured strip.

## Purpose

Builds the documents that the block sidebar needs. The seed uses them for new datasets. `sidebar-migrate.mjs` uses them for existing datasets. `homeFeaturedBlock` returns the home's "Articles à la une" block: a `module.blog-featured` with `layout: "editorial"`, `source: "flag"`, and `limit: 4`. `sidebarSettingsDoc` returns `sidebarSettings-<lang>`. In it, articles show the post's table of contents and four related posts. Every other page type keeps the empty default, so it has no sidebar.

## Exports

- `HOME_FEATURED_COPY` — the featured block copy (`eyebrow`, `title`, `intro`, `viewAll`) per locale (`en`, `fr`).
- `homeFeaturedBlock(lang, _key)` — the home's `module.blog-featured` block, anchored at `home-featured`.
- `sidebarSettingsDoc(lang, key)` — the `sidebarSettings-<lang>` document. `key` is a function that returns a new `_key`.

## Usage

```js
import {
  homeFeaturedBlock,
  sidebarSettingsDoc,
} from "./lib/blocks-sidebar.mjs";

const sections = [homeFeaturedBlock("fr", key())];
await client.createIfNotExists(sidebarSettingsDoc("fr", key));
```

## Source

`code/projects/web/surfaces/website/scripts/lib/blocks-sidebar.mjs`
