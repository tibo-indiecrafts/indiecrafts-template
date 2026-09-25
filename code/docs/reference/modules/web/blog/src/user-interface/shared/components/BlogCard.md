---
title: "Blog post card"
description: "Async React component that renders a blog post preview card with media, category, title, excerpt, and author footer."
status: stable
---

# Blog post card

> One quiet card structure shared by the blog listing, category explorer, and author detail.

## Purpose

`BlogCard` renders a single post preview: featured media (image or inline-playable video), a category chip, the title, a short excerpt, and an author + date footer. The title link is stretched over the whole card, so a click anywhere that is not the play button or a raised link opens the post. It is an async server component that reads the editor's display toggles via `getBlogSettings()`.

## Exports

- `BlogCard` — async component taking `{ post, locale, variant? }`; `variant` is `"tall"` (default) or `"wide"` and controls the media aspect ratio.

## Usage

```tsx
import { BlogCard } from "@indiecrafts/modules-web-blog/user-interface/shared/components/BlogCard";

<ul>
  {posts.map((post) => (
    <li key={post._id}>
      <BlogCard post={post} locale={locale} />
    </li>
  ))}
</ul>;
```

## Source

`code/modules/web/blog/src/user-interface/shared/components/BlogCard.tsx`
