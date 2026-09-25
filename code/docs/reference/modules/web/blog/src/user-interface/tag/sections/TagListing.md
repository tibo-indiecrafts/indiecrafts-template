---
title: "Tag listing section"
description: "Tag index page with tags sorted by post count descending."
status: stable
---

# Tag listing section

> The `/blog/tag` index — the most active tags lead.

## Purpose

`TagListing` renders the tag index page at `/blog/tag`. Tags are sorted by post count descending so the most active tags lead. Empty (zero-post) tags are filtered out by the GROQ query that feeds this list. It composes `Breadcrumbs`, `PageHero`, and `TagCard`, and shows `emptyLabel` when there are no tags.

## Exports

- `TagListing` — component taking `{ tags, breadcrumbs, breadcrumbsLabel, heading, subheading, emptyLabel, postsLabel, pills? }`.

## Usage

```tsx
import { TagListing } from "@indiecrafts/modules-web-blog/user-interface/tag/sections/TagListing";

<TagListing
  tags={tags}
  breadcrumbs={breadcrumbs}
  breadcrumbsLabel={t("breadcrumbs")}
  heading={t("tags.heading")}
  subheading={t("tags.subheading")}
  emptyLabel={t("tags.empty")}
  postsLabel={t("postsCount")}
/>;
```

## Source

`code/modules/web/blog/src/user-interface/tag/sections/TagListing.tsx`
