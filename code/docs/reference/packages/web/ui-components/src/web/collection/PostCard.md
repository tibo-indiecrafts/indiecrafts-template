---
title: "Post card"
description: "Renders one compact post card shared across the collection blocks."
status: stable
---

# Post card

> The shared compact post-card primitive.

## Purpose

Renders one compact post card with image, category chip, title, and author and date. It is the shared card primitive reused by `FeaturedPosts`, `SpotlightRow`, and `Carousel` so every collection block renders identical cards.

## Exports

- `PostCard` — one compact post card from a resolved `PostCardItem`.

## Usage

```tsx
import { PostCard } from "@indiecrafts/packages-web-ui-components/web/collection/PostCard";

<PostCard post={post} />;
```

## Source

`code/packages/web/ui-components/src/web/collection/PostCard.tsx`
