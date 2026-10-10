---
title: "Related posts renderer"
description: "Sidebar card that lists other posts sharing a category with the current post."
status: stable
---

# Related posts renderer

> Posts on the same topic as the current post, as a compact link list.

## Purpose

`BlogRelated` renders the `blog-related` sidebar card. It fetches other posts that share a category with `post` (`relatedPostsQuery`, at most `limit`, default 4). A post with no category gets the latest posts. The heading is the editor's `title`, else "More on `<category>`", else "More reading". When categories show, a footer links to the category page. It renders through `PostLinks`. It returns `null` outside a post.

## Exports

- `BlogRelated` — async server component; takes `module` (`BlogRelatedModule`), optional `post` (`Post`), and `locale` (`Locale`).

## Usage

```tsx
import { BlogRelated } from "@indiecrafts/modules-web-blog/user-interface/renderers/BlogRelated";

<BlogRelated module={m} post={post} locale={locale} />;
```

## Source

`code/modules/web/blog/src/user-interface/renderers/BlogRelated.tsx`
