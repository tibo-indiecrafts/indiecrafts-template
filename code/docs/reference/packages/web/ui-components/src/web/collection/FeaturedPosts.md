---
title: "Featured posts"
description: "Renders an optional lead card over a grid of compact featured post cards."
status: stable
---

# Featured posts

> A lead card over a grid of featured posts.

## Purpose

Renders the blog's `module.blog-featured` block. An optional large lead card spans the grid, with compact `PostCard`s for the rest. All data is pre-resolved, so the component stays presentational.

## Exports

- `FeaturedPosts` — an optional lead card plus a grid of compact post cards.

## Usage

```tsx
import { FeaturedPosts } from "@indiecrafts/packages-web-ui-components/web/collection/FeaturedPosts";

<FeaturedPosts heading="Featured" lead={leadPost} items={posts} />;
```

## Source

`code/packages/web/ui-components/src/web/collection/FeaturedPosts.tsx`
