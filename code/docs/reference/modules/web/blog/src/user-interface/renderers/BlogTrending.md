---
title: "Trending renderer"
description: "Frontpage block showing the most popular posts, falling back to most recent."
status: stable
---

# Trending renderer

> Merges pinned and popular (or recent) posts up to a shared cap, on `SpotlightRow`.

## Purpose

`BlogTrending` renders the frontpage "Trending" block. It reads the most-viewed post ids of the last 30 days from `getPopularPostIds` (see `lib/popularity.ts`) and orders those posts first, with the latest posts filling any gap (`popularThenLatest`) — so the block stays full while few posts have views, and shows the latest posts if the counter is unreachable. The editor's `pinned` posts take precedence, up to the shared `count` cap (`mergePinnedWithFallback`). The block always renders content once any post exists. Each post maps through `toPostCard`. It renders the generic `SpotlightRow` primitive with no "view all" link. With `compact` (in a sidebar), it renders a `PostLinks` list instead.

## Exports

- `BlogTrending` — async server component; takes `module` (`BlogTrendingModule`), `locale` (`Locale`), and optional `compact` (boolean).

## Usage

```tsx
import { BlogTrending } from "@indiecrafts/modules-web-blog/user-interface/renderers/BlogTrending";

<BlogTrending module={m} locale={locale} />;
```

## Source

`code/modules/web/blog/src/user-interface/renderers/BlogTrending.tsx`
