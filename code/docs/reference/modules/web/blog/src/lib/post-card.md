---
title: "Post card mapper"
description: "Maps a post to the PostCardItem shape that every blog block renders."
status: stable
---

# Post card mapper

> One post in, one `PostCardItem` out.

## Purpose

`toPostCard` turns a `PostListItem` into the `PostCardItem` shape of the shared card primitives. Every blog block uses it, so all post cards carry the same fields. The link is the localized `/blog/<slug>` path. The title is the SEO title, else the post title. The cover alt text (`imageAlt`) is the SEO image alt, when set. The excerpt is the SEO description. The card shows the first category and the first author only when the editor shows that taxonomy (`display.taxonomy`).

## Exports

- `toPostCard(post, locale, display)` — returns the `PostCardItem`: `_key`, `href`, `title`, `image`, `imageAlt`, `lqip`, `category`, `author`, `date`, `excerpt`, `video`.

## Usage

```ts
import { toPostCard } from "@indiecrafts/modules-web-blog/lib/post-card";

const display = await getBlogSettings();
const items = posts.map((post) => toPostCard(post, locale, display));
```

## Source

`code/modules/web/blog/src/lib/post-card.ts`
