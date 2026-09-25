---
title: "Tag card"
description: "Single tag card linking to the tag's post archive."
status: stable
---

# Tag card

> A lighter card than the category card, for the finer-grained tag labels.

## Purpose

`TagCard` renders one tag as a card for the `/blog/tag` index. It is visually lighter than the category card (tags are finer-grained labels) but built on the same primitives so they fit on the same surface. The card shows the tag title, a post count badge, and an optional description. It returns `null` when the tag has no slug.

## Exports

- `TagCard` — component taking `{ tag, postsLabel }`; `postsLabel` supports a `{count}` placeholder.

## Usage

```tsx
import { TagCard } from "@indiecrafts/modules-web-blog/user-interface/tag/components/TagCard";

<TagCard tag={tag} postsLabel={t("postsCount")} />;
```

## Source

`code/modules/web/blog/src/user-interface/tag/components/TagCard.tsx`
