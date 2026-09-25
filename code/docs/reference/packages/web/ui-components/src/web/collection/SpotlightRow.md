---
title: "Spotlight row"
description: 'Renders a curated spotlight row of post cards with a "view all" link.'
status: stable
---

# Spotlight row

> A curated spotlight row of post cards.

## Purpose

Renders the blog's category or trending spotlight block (`module.blog-category-spotlight`, `module.blog-trending`): a heading, optional subheading, and "view all" link over a reflowing row of curated post cards. It shares `PostCard` with the other collection blocks.

## Exports

- `SpotlightRow` — a heading and "view all" link over a row of curated post cards.

## Usage

```tsx
import { SpotlightRow } from "@indiecrafts/packages-web-ui-components/web/collection/SpotlightRow";

<SpotlightRow
  heading="Trending"
  items={posts}
  viewAll={{ label: "View all", href: "/blog/trending" }}
/>;
```

## Source

`code/packages/web/ui-components/src/web/collection/SpotlightRow.tsx`
