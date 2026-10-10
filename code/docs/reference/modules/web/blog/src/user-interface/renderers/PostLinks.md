---
title: "Post links"
description: "The sidebar form of the blog's post blocks: a heading over title and date links."
status: stable
---

# Post links

> Post cards as a compact list of title + date links.

## Purpose

`PostLinks` is the sidebar form of the blog's post blocks (featured, trending, latest, collection, related). A sidebar is too narrow for cards, so the block shows links, not smaller cards. It maps each `PostCardItem` to a title, a link and the date as meta, and renders `MoreOnTopic`. It renders nothing with no post.

## Exports

- `PostLinks` — takes `title` (string), `items` (`PostCardItem[]`), and an optional `footer` (`{ label, href }`).

## Usage

```tsx
import { PostLinks } from "@indiecrafts/modules-web-blog/user-interface/renderers/PostLinks";

<PostLinks title={heading} items={items} footer={viewAll} />;
```

## Source

`code/modules/web/blog/src/user-interface/renderers/PostLinks.tsx`
