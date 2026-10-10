---
title: "Table of contents"
description: "The table of contents with scroll-spy for a post, shown in the blog-toc sidebar card."
status: stable
---

# Table of contents

> Sidebar anchor list for a post's h2/h3/h4 headings, with active-heading tracking.

## Purpose

`Toc` renders the table of contents for the `blog-toc` sidebar card, anchoring to the h2/h3/h4 headings in the body. It is a client component so it can run scroll-spy: an `IntersectionObserver` marks the heading nearest the top of the viewport with `aria-current="location"`. The heading list is memoised, so the observer does not restart on each render. The sidebar shows the card from `lg`; below that, `MobileToc` opens the same list above the article. Heading ids come from `slugify`.

## Exports

- `Toc` — client component; takes `headings` (`Heading[]`) and `title` (string). Returns `null` when `headings` is empty.

## Usage

```tsx
import { Toc } from "@indiecrafts/modules-web-blog/user-interface/post/components/Toc";

<Toc headings={post.headings!} title={t("onThisPage")} />;
```

## Source

`code/modules/web/blog/src/user-interface/post/components/Toc.tsx`
