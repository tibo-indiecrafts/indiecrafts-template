---
title: "Gallery module"
description: "Sanity schema for the image-gallery page-builder module."
status: stable
---

# Gallery module

> A swipeable image carousel with thumbnails, a counter, and click-to-zoom.

## Purpose

Defines the `module.gallery` block: an optional title and intro, a `ratio` option for the carousel frame, and a required array of images, each with alt text. Rendered by `GalleryCarousel` (a client component using embla); the GROQ projection in `MODULES_FRAGMENT` resolves each image to its CDN url plus `lqip` and dimensions for a blurred placeholder.

## Exports

- `default` — the `module.gallery` schema built with `defineModule`.

## Source

`code/packages/web/page-builder/src/sanity/schema/modules/gallery.ts`
