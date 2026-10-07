---
title: "Author listing section"
description: "The /author index section — a grid of author cards for authors with at least one published post."
status: stable
---

# Author listing section

> The `/author` index: a hero plus a grid of author cards.

## Purpose

Renders the `/author` index page. Shows breadcrumbs, a `PageHero`, and a grid of `AuthorCard`s. The author list arrives pre-filtered to those with at least one published post in the current locale; an empty list shows the empty-state label.

## Exports

- `AuthorListing` — server component. Props: `authors` (`Author[]`), `breadcrumbs`, `breadcrumbsLabel`, `heading`, `subheading`, `emptyLabel`, `postsLabel` (`(count) => string`, the post-count label), and optional `pills`.

## Usage

```tsx
import { AuthorListing } from "@indiecrafts/modules-web-blog/user-interface/author/sections/AuthorListing";

<AuthorListing
  authors={authors}
  breadcrumbs={crumbs}
  breadcrumbsLabel={t("breadcrumbs")}
  heading={t("heading")}
  subheading={t("subheading")}
  emptyLabel={t("empty")}
  postsLabel={(count) => t("posts", { count })}
/>;
```

## Source

`code/modules/web/blog/src/user-interface/author/sections/AuthorListing.tsx`
