---
title: "Featured media"
description: "Renders a post or page cover as an image or an in-place video player."
status: stable
---

# Featured media

> One box for a cover, whether it is an image, an uploaded video, or an embed link.

## Purpose

Renders a post or page cover in a single, consistent frame. It shows the image
with `next/image`, and when `videoUrl` resolves to a known provider it adds a
player. With `autoplay` the player mounts muted and looping as an ambient
backdrop; otherwise a play button swaps the poster for the player in place (no
dialog). A direct file uses a native `<video>`; YouTube, Vimeo, and Dailymotion
use a lazy `<iframe>`.

## Exports

- `FeaturedMedia` — the component. Props: `image`, `alt`, `videoUrl`, `lqip`, `aspect`, `sizes`, `priority`, `interactive`, `autoplay`, `controls`, `playLabel` (required), and `className`.

## Usage

```tsx
import { FeaturedMedia } from "@indiecrafts/packages-web-ui-components/web/media/FeaturedMedia";

<FeaturedMedia
  image={post.cover}
  alt={post.title}
  videoUrl={post.videoUrl}
  playLabel="Play video"
/>;
```

## Source

`code/packages/web/ui-components/src/web/media/FeaturedMedia.tsx`
