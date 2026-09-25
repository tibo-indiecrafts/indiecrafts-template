---
title: "Top authors section"
description: "Frontpage block showing up to six authors as portrait tiles linking to their pages."
status: stable
---

# Top authors section

> Up to six author portrait tiles for the `/blog` frontpage.

## Purpose

Renders the top authors block on the `/blog` frontpage. Authors are sorted by post count descending and capped at six. Each tile is a link to the author's detail page and shows the portrait (or a placeholder), name, and position. A "view all" link to `/author` appears when there are more authors than shown. Shares the compact grid layout used by the post-page `PersonList`. Returns `null` when there are no authors.

## Exports

- `TopAuthors` — server component. Props: `authors` (`Author[]`), `heading`, optional `subheading`, and `viewAllLabel`.

## Usage

```tsx
import { TopAuthors } from "@indiecrafts/modules-web-blog/user-interface/blog/sections/TopAuthors";

<TopAuthors
  authors={authors}
  heading={t("authors.heading")}
  subheading={t("authors.subheading")}
  viewAllLabel={t("authors.viewAll")}
/>;
```

## Source

`code/modules/web/blog/src/user-interface/blog/sections/TopAuthors.tsx`
