---
title: "Block types"
description: "Names the blog blocks that describe the post being read, as a runtime constant."
status: stable
---

# Block types

> The blog blocks that only make sense on a post.

## Purpose

Lists the blocks that describe the post being read: `module.blog-toc`, `module.blog-related` and `module.blog-post-content`. They render nothing on any other page. The blog's `Modules` skips them off a post, and the website's `pageSidebar` drops them from every sidebar that is not a post's, so no empty column is left. The file holds no schema code, so the site's runtime does not import Sanity schema definitions.

## Exports

- `POST_ONLY_TYPES` — a `ReadonlySet<string>` of the three block types.

## Usage

```ts
import { POST_ONLY_TYPES } from "@indiecrafts/modules-web-blog/sanity/block-types";

const cards = blocks.filter((b) => !POST_ONLY_TYPES.has(b._type));
```

## Source

`code/modules/web/blog/src/sanity/block-types.ts`
