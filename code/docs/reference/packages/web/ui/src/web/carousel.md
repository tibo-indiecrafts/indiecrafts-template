---
title: "Carousel"
description: "shadcn/ui data-driven image carousel with a 3D tilt and prev/next controls."
status: stable
---

# Carousel

> A data-driven image carousel with a pointer-tracking 3D tilt.

## Purpose

A CLI-managed shadcn/ui primitive. It renders a slideshow from a `slides` array — each slide has a title, a button label, and an image source — with a 3D tilt that follows the pointer and previous/next controls. Do not hand-edit; `shadcn add` regenerates it.

## Exports

- `default` (`Carousel`) — the carousel; takes `slides`, an array of `{ title, button, src }`.

## Usage

```tsx
import Carousel from "@indiecrafts/packages-web-ui/web/carousel";

<Carousel
  slides={[{ title: "Spring drop", button: "Shop", src: "/spring.jpg" }]}
/>;
```

## Source

`code/packages/web/ui/src/web/carousel.tsx`
