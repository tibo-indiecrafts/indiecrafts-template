---
title: "Default blog frontpage"
description: "The code-default /blog frontpage — hero, search, explore categories/tags, and top authors."
status: stable
---

# Default blog frontpage

> The built-in `/blog` layout, used when the editor has not composed frontpage modules.

## Purpose

Renders the code-default `/blog` frontpage: hero mosaic (or a titled grid), optional search box, then the explore categories, explore tags, and top authors sections. It renders when `blog.frontpageModules` is empty (see `pickFrontpage`). Each section is gated by the resolved display toggles. When there are no posts, it falls back to a single `BlogListing`.

## Exports

- `DefaultBlogFrontpage` — server component. Props: `posts`, `locale`, `display` (`BlogDisplay`), `categories`, `tags`, `authors`, `t` (a next-intl translator), `searchAction`, and `searchEnabled`.

## Usage

```tsx
import { DefaultBlogFrontpage } from "@indiecrafts/modules-web-blog/user-interface/blog/sections/DefaultBlogFrontpage";

<DefaultBlogFrontpage
  posts={posts}
  locale={locale}
  display={display}
  categories={categories}
  tags={tags}
  authors={authors}
  t={t}
  searchAction="/blog/search"
  searchEnabled={searchEnabled}
/>;
```

## Source

`code/modules/web/blog/src/user-interface/blog/sections/DefaultBlogFrontpage.tsx`
