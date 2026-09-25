---
title: "Series navigation"
description: "The 'Part N of M' navigation block listing every post in a series."
status: stable
---

# Series navigation

> Ordered list of a series' parts, with the current post marked and the others linked.

## Purpose

`SeriesNav` renders the "Part N of M" block on a post that belongs to a series. It lists the parts in order, marks the current one with `aria-current`, and links the others. The `parts` and their order come from the `series` projection of `postBySlugQuery`. It renders nothing for a lone post (fewer than two parts) or when the series has no slug.

## Exports

- `SeriesNav` — component; takes `series` (`SeriesRef`), `currentId` (string), and `labels` (`{ label, partOf }`). The `partOf` label uses `{n}` and `{total}` placeholders that the component fills.

## Usage

```tsx
import { SeriesNav } from "@indiecrafts/modules-web-blog/user-interface/post/components/SeriesNav";

<SeriesNav
  series={post.series}
  currentId={post._id}
  labels={{
    label: t("series.navLabel"),
    partOf: t.raw("series.partOf") as string,
  }}
/>;
```

## Source

`code/modules/web/blog/src/user-interface/post/components/SeriesNav.tsx`
