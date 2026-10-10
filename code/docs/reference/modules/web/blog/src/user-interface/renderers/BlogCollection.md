---
title: "Collection renderer"
description: "Frontpage block showing a pinned, ordered set of posts in a carousel."
status: stable
---

# Collection renderer

> Maps an editor-pinned, ordered post selection onto the client `Carousel` primitive.

## Purpose

`BlogCollection` renders the frontpage "Collection" block. It is pinned-only (no automatic or flag source, unlike the featured block): it fetches the referenced posts (`blogCollectionQuery`), restores the editor's manual order with `reorderByIds`, maps each with `toPostCard`, and renders them in a `Carousel`. With `compact` (in a sidebar), it renders a `PostLinks` list instead. It returns `null` when no post matches.

## Exports

- `BlogCollection` — async server component; takes `module` (`BlogCollectionModule`), `locale` (`Locale`), and optional `compact` (boolean).

## Usage

```tsx
import { BlogCollection } from "@indiecrafts/modules-web-blog/user-interface/renderers/BlogCollection";

<BlogCollection module={m} locale={locale} />;
```

## Source

`code/modules/web/blog/src/user-interface/renderers/BlogCollection.tsx`
