---
title: "Storybook fixtures"
description: "Reusable Storybook fixtures — resolved data shapes the block renderers expect."
status: stable
---

# Storybook fixtures

> Reusable resolved-data fixtures for the block-renderer stories.

## Purpose

This module provides reusable Storybook fixtures. They return the resolved data
shapes the block renderers expect — Portable Text blocks, image references, and
gallery images — so stories can drive the renderers without a Sanity client.

## Exports

- `body(text)` — builds a single-block `PortableTextBlock[]` from a plain string.
- `img(seed, alt?)` — builds an `ImageRef` backed by a `picsum.photos` seed URL.
- `galleryImages` — a fixed `GalleryImage[]` of four sample images.

## Usage

```ts
import {
  body,
  img,
  galleryImages,
} from "@indiecrafts/packages-web-ui-components/web/_mock";

const args = {
  title: "Sample",
  content: body("Hello world"),
  image: img("hero"),
};
```

## Source

`code/packages/web/ui-components/src/web/_mock.ts`
