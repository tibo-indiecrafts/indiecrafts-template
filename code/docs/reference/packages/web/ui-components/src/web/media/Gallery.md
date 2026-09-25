---
title: "Gallery block"
description: "Server renderer for the module.gallery block that wraps the client carousel."
status: stable
---

# Gallery block

> The server half of the gallery module — spacing, title, and intro around the carousel.

## Purpose

Renders the `module.gallery` page-builder block. It owns the block's spacing and
the optional title and intro, then hands the filtered images to the client
`GalleryCarousel` (embla cannot run on the server). It renders nothing when every
image is empty.

## Exports

- `Gallery` — the component; takes a `GalleryModule` (`title`, `intro`, `ratio`, `images`, `anchor`).

## Usage

```tsx
import { Gallery } from "@indiecrafts/packages-web-ui-components/web/media/Gallery";

<Gallery {...galleryModule} />;
```

## Source

`code/packages/web/ui-components/src/web/media/Gallery.tsx`
