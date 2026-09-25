---
title: "Trending popularity signal"
description: "Returns the popular post ids for the Trending block (currently empty)."
status: stable
---

# Trending popularity signal

> The Trending block's popularity source — a stub today.

## Purpose

Supplies the popular post ids for the `blog-trending` block. The current project has no read-count source, so this returns `[]` and the renderer falls back to most-recent. A future read-count pipeline replaces the body only; the Trending block is unchanged.

## Exports

- `getPopularPostIds(locale, count)` — resolves to an array of post `_id`s (currently `[]`).

## Usage

```ts
import { getPopularPostIds } from "@indiecrafts/modules-web-blog/lib/popularity";

const ids = await getPopularPostIds(locale, 6);
```

## Source

`code/modules/web/blog/src/lib/popularity.ts`
