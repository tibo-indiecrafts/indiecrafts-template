---
title: "Blog Sanity module"
description: "The blog's Sanity contribution barrel for composeSanity."
status: stable
---

# Blog Sanity module

> One barrel the app drops into `composeSanity([...])`.

## Purpose

The blog's Sanity contribution — its schema, desk section, per-(type, locale) create templates, email groups, and the list of its document-internationalized types. Adding or removing the blog is one line in `sanity.config.ts`. The create templates seed `language` per locale, so "+ Create" on a locale leaf starts in that language.

## Exports

- `blogSanity` — the `SanityModule` barrel (name, schema, structure, email groups, i18n types, templates).

## Usage

```ts
import { blogSanity } from "@indiecrafts/modules-web-blog/sanity";

const studio = composeSanity([blogSanity]);
```

## Source

`code/modules/web/blog/src/sanity/index.ts`
