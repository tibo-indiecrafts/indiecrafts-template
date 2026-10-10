---
title: "Table of contents renderer"
description: "Sidebar card that renders the current post's headings with the Toc component."
status: stable
---

# Table of contents renderer

> The `blog-toc` card: the current post's headings.

## Purpose

`BlogToc` renders the `blog-toc` sidebar card. It passes the post's headings to `Toc`. The title is the editor's `title`, else the "On this page" message. It returns `null` outside a post or when the post has no heading.

## Exports

- `BlogToc` — async server component; takes `module` (`BlogTocModule`), optional `post` (`Post`), and `locale` (`Locale`).

## Usage

```tsx
import { BlogToc } from "@indiecrafts/modules-web-blog/user-interface/renderers/BlogToc";

<BlogToc module={m} post={post} locale={locale} />;
```

## Source

`code/modules/web/blog/src/user-interface/renderers/BlogToc.tsx`
