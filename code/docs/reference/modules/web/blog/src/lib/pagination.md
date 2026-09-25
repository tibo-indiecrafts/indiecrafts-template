---
title: "Listing pagination math"
description: "Shared page-number and GROQ-range helpers for the blog listings."
status: stable
---

# Listing pagination math

> Tiny, framework-free pagination shared by the route and the pager.

## Purpose

One source of pagination math for the category / tag / author listings, so the route (range to GROQ) and the `<Pager>` (page count to links) agree. Fixed at 12 posts per page.

## Exports

- `POSTS_PER_PAGE` — posts per page (12).
- `parsePage(raw)` — a `?page=` value to a 1-based page number (junk falls back to 1).
- `pageRange(page)` — GROQ slice bounds `{ start, end }` (end exclusive).
- `pageCount(total)` — total pages for `total` items (never below 1).

## Usage

```ts
import {
  parsePage,
  pageRange,
} from "@indiecrafts/modules-web-blog/lib/pagination";

const page = parsePage(searchParams.page);
const { start, end } = pageRange(page);
```

## Source

`code/modules/web/blog/src/lib/pagination.ts`
