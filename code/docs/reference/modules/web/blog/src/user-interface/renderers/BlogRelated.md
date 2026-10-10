---
title: "Related posts renderer"
description: "Sidebar card that lists other posts sharing a category with the current post."
status: stable
---

# Related posts renderer

> Posts on the same topic as the current post, as a compact link list.

## Purpose

`BlogRelated` renders the `blog-related` sidebar card. It does not fetch. The post route fetches the `related` posts once: the posts that share a category with `post`, else the latest posts. The card shows up to `limit` of them (default 4). The heading is the editor's `title`, else "More on `<category>`", else "More reading". When categories show, a footer links to the category page. It renders through `PostLinks`. It returns `null` outside a post or with no related post.

## Exports

- `BlogRelated` — async server component; takes `module` (`BlogRelatedModule`), optional `post` (`Post`), optional `related` (`PostListItem[]`), and `locale` (`Locale`).

## Usage

```tsx
import { BlogRelated } from "@indiecrafts/modules-web-blog/user-interface/renderers/BlogRelated";

<BlogRelated module={m} post={post} related={related} locale={locale} />;
```

## Source

`code/modules/web/blog/src/user-interface/renderers/BlogRelated.tsx`
