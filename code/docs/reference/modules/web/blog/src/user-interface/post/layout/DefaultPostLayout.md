---
title: "Default post layout"
description: "The server-rendered single-post page used when no module layout is configured."
status: stable
---

# Default post layout

> The full single-post page: hero, body with its sidebar cards, and related grid.

## Purpose

`DefaultPostLayout` is the server-rendered post page shown when the `blog` singleton's `postModules` array is empty. It builds the editorial layout: breadcrumb trail, title and lead, a hero image or inline video (`FeaturedMedia`), the PortableText body, the author bio, a back-link and optional share row, and a "Keep reading" related-posts grid. `WithSidebar` puts the sidebar cards (`aside`) beside the body; with no card, the body takes the full width. The route resolves the cards from Site web → Barre latérale and the post's own choice (`postSidebar`). With `mobileToc`, `MobileToc` shows the headings above the body on a phone. Author, category, and tag chips follow the editor's display toggles. Reading progress, series nav, and related posts each render only when their setting is on.

## Exports

- `DefaultPostLayout` — async server component; takes `post` (`Post`), `locale`, `title`, `related` (`PostListItem[]`), `mobileToc` (boolean), and optional `aside` (the sidebar cards), `image`, `description`, and `share` (site-wide share config; absent hides the share row).

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
  aside={sidebar.aside}
  mobileToc={sidebar.mobileToc}
  share={siteSettings.share}
/>;
```

## Source

`code/modules/web/blog/src/user-interface/post/layout/DefaultPostLayout.tsx`
