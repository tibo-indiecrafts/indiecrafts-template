---
title: "Featured editorial"
description: "Renders a lead post card beside a short list of runners-up."
status: stable
---

# Featured editorial

> A large lead card beside up to three compact post rows.

## Purpose

`FeaturedEditorial` is the `editorial` layout of `FeaturedPosts`. The first post renders as a large card: image or an in-place video, category, title, excerpt and meta. The next three posts render as compact rows with a thumbnail, title and meta. The card and the rows sit side by side from a `@4xl` container and stack below it. With no runners-up, the lead card takes the full width. It renders nothing when `posts` is empty.

## Exports

- `FeaturedEditorial` — takes `posts` (`PostCardItem[]`) and `playLabel` (the lead video's play button label, from the host's messages).

## Usage

```tsx
import { FeaturedEditorial } from "@indiecrafts/packages-web-ui-components/web/collection/FeaturedEditorial";

<FeaturedEditorial posts={posts} playLabel={t("play")} />;
```

## Source

`code/packages/web/ui-components/src/web/collection/FeaturedEditorial.tsx`
