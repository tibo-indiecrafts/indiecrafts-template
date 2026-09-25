---
title: "Blog index hero"
description: "Frontpage hero for /blog showing an eyebrow, title, and intro."
status: stable
---

# Blog index hero

> Simple centered `/blog` hero; the posts themselves render in `BlogPostList`.

## Purpose

`BlogIndex` renders the `/blog` hero: an optional eyebrow, the title (an `<h1>`), and an intro paragraph, centered in a narrow column. It holds no post data; the article list is rendered by `BlogPostList`. This is one of the three `postModules`-era blocks that predate the frontpage/post split.

## Exports

- `BlogIndex` — component; takes `BlogIndexModule` props directly (`anchor`, `eyebrow`, `title`, `intro`).

## Usage

```tsx
import { BlogIndex } from "@indiecrafts/modules-web-blog/user-interface/renderers/BlogIndex";

<BlogIndex {...m} />;
```

## Source

`code/modules/web/blog/src/user-interface/renderers/BlogIndex.tsx`
