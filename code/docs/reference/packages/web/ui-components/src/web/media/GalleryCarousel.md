---
title: "Gallery carousel"
description: "Client image-gallery carousel with a synced thumbnail strip and a full-screen lightbox."
status: stable
---

# Gallery carousel

> The client half of the gallery module — embla carousel, thumbnails, and lightbox.

## Purpose

Renders the client half of the `module.gallery` block, mounted by the server
`Gallery` wrapper. It uses the embla "thumbnails" pattern: a main viewport synced
to a drag-free thumbnail strip. Each image supports swipe and drag, keyboard prev
and next arrows, an editorial counter, per-image captions, and click-to-zoom into
a full-screen lightbox. A single image drops the carousel chrome but keeps zoom.

## Exports

- `GalleryCarousel` — the component. Props: `images` (a `GalleryImage[]`) and optional `ratio` (for example `"3:2"` or `"16:9"`).

## Usage

```tsx
import { GalleryCarousel } from "@indiecrafts/packages-web-ui-components/web/media/GalleryCarousel";

<GalleryCarousel images={images} ratio="3:2" />;
```

## Source

`code/packages/web/ui-components/src/web/media/GalleryCarousel.tsx`
