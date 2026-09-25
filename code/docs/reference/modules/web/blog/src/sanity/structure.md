---
title: "Blog desk structure"
description: "Builds the blog's Studio desk sections — content lists and the comment moderation queue."
status: stable
---

# Blog desk structure

> The blog's own top-level Studio desk items, stitched into the app's content list.

## Purpose

Returns the blog's Studio desk list items: a Blog section (the singleton plus language-split lists for posts, authors, categories, tags, and series) and a Commentaires section with En attente, Approuvés, and Spam moderation queues. The app's `composeSanity` merges these with the app-core sections into one "Contenu" list; this module no longer owns the whole resolver.

## Exports

- `blogStructure(S)` — takes a `StructureBuilder` and returns `ListItemBuilder[]` for the blog desk sections.

The `languageSplit` and `languageList` helpers are internal (not exported).

## Usage

```ts
import { blogStructure } from "@indiecrafts/modules-web-blog/sanity/structure";

export const structure = (S) =>
  S.list().title("Contenu").items(blogStructure(S));
```

## Source

`code/modules/web/blog/src/sanity/structure.ts`
