---
title: "Reading progress bar"
description: "A fixed top-of-viewport bar that tracks scroll progress through a post."
status: stable
---

# Reading progress bar

> A thin decorative bar that fills left-to-right as the reader scrolls.

## Purpose

`ReadingProgress` renders a thin bar fixed to the top of the viewport that tracks how far the reader has scrolled. It is decorative (`aria-hidden`), updates the bar's `scaleX` directly through a ref (no state, no re-render), and throttles writes to one per animation frame. It is gated by `blog.display.post.readingProgress`.

## Exports

- `ReadingProgress` — client component; takes no props.

## Usage

```tsx
import { ReadingProgress } from "@indiecrafts/modules-web-blog/user-interface/post/components/ReadingProgress";

{
  display.post.readingProgress ? <ReadingProgress /> : null;
}
```

## Source

`code/modules/web/blog/src/user-interface/post/components/ReadingProgress.tsx`
