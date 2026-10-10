---
title: "Post content renderer"
description: "Module that renders the active post's header and body from render context."
status: stable
---

# Post content renderer

> Renders a post's category, title, meta, cover, body, and tags from the render context.

## Purpose

`BlogPostContent` renders the active post's header and body. The module schema has no fields of its own; the content comes from the `post` passed via render context. It renders the category chip, title, description, byline (linked only for a single author with a page), publish date, cover image, PortableText body, and tag chips, each gated by the editor's taxonomy toggles. `WithSidebar` puts the post's sidebar cards (`sidebar.aside`) beside the article. When `sidebar.mobileToc` is on, `MobileToc` shows the headings above the body on a phone. It renders only in a composed `postModules` layout; with no `postModules`, the `/blog/[slug]` route renders `DefaultPostLayout`.

## Exports

- `BlogPostContent` — async server component; takes `module` (`BlogPostContentModule`), `post` (`Post`), `locale` (`Locale`), and optional `sidebar` (`PostSidebar`).

## Usage

```tsx
import { BlogPostContent } from "@indiecrafts/modules-web-blog/user-interface/renderers/BlogPostContent";

<BlogPostContent
  module={m}
  post={post}
  locale={locale}
  sidebar={postSidebar}
/>;
```

## Source

`code/modules/web/blog/src/user-interface/renderers/BlogPostContent.tsx`
