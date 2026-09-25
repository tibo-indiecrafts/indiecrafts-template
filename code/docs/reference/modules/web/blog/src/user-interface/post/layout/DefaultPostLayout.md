---
title: "Default post layout"
description: "The server-rendered single-post page used when no module layout is configured."
status: stable
---

# Default post layout

> The full single-post page: hero, two-column body, sticky sidebar, and related grid.

## Purpose

`DefaultPostLayout` is the server-rendered post page shown when the `blog` singleton's `postModules` array is empty. It builds the editorial two-column layout: breadcrumb trail, title and lead, a hero image or inline video (`FeaturedMedia`), the PortableText body, a sticky right sidebar (`Toc` plus "More on topic"), the author bio, a back-link and optional share row, and a "Keep reading" related-posts grid. Author, category, and tag chips follow the editor's display toggles, and reading progress, table of contents, series nav, and related posts each render only when their setting is on.

## Exports

- `DefaultPostLayout` — async server component; takes `post` (`Post`), `locale`, `title`, `related` (`PostListItem[]`), and optional `image`, `description`, and `share` (site-wide share config; absent hides the share row).

## Usage

```tsx
import { DefaultPostLayout } from "@indiecrafts/modules-web-blog/user-interface/post/layout/DefaultPostLayout";

<DefaultPostLayout
  post={post}
  locale={locale}
  title={title}
  description={description}
  image={coverUrl}
  related={related}
  share={siteSettings.share}
/>;
```

## Source

`code/modules/web/blog/src/user-interface/post/layout/DefaultPostLayout.tsx`
