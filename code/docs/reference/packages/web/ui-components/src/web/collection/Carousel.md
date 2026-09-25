---
title: "Post carousel"
description: "Renders a CSS scroll-snap row of post cards with prev/next buttons."
status: stable
---

# Post carousel

> A scroll-snap row of post cards.

## Purpose

Renders the blog's `module.blog-collection` block as a horizontally scrolling row of post cards. It uses CSS scroll-snap with prev/next buttons instead of a carousel library. It shares `PostCard` with `FeaturedPosts` and `SpotlightRow`, and follows the W3C carousel accessibility pattern.

## Exports

- `Carousel` — a client scroll-snap row of `PostCard`s with prev/next buttons.

## Usage

```tsx
import { Carousel } from "@indiecrafts/packages-web-ui-components/web/collection/Carousel";

<Carousel
  heading="Latest posts"
  items={posts}
  labels={{ prev: "Previous", next: "Next", slide: "Slide" }}
/>;
```

## Source

`code/packages/web/ui-components/src/web/collection/Carousel.tsx`
