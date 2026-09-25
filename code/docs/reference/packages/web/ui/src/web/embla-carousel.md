---
title: "Carousel"
description: "A styled carousel built on embla-carousel with keyboard and button controls."
status: stable
---

# Carousel

> Horizontal or vertical slider from `embla-carousel-react`, with previous/next buttons and arrow-key navigation.

## Purpose

`Carousel` wraps `embla-carousel-react` in a context that tracks scroll state and exposes previous/next controls. It supports horizontal and vertical orientation, plugins, and an external API handle via `setApi`. Arrow keys scroll the track when it is focused.

> This file carries an upstream `@ts-nocheck` directive; the shadcn source is kept as-is.

## Exports

- `Carousel` — the root; accepts `opts`, `plugins`, `orientation`, and `setApi`.
- `CarouselContent` — the scrollable track wrapper.
- `CarouselItem` — one slide.
- `CarouselPrevious` — a button that scrolls to the previous slide.
- `CarouselNext` — a button that scrolls to the next slide.
- `CarouselApi` — the Embla API type, re-exported for `setApi` consumers.

## Usage

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@indiecrafts/packages-web-ui/web/embla-carousel";

export function Slides() {
  return (
    <Carousel>
      <CarouselContent>
        <CarouselItem>Slide 1</CarouselItem>
        <CarouselItem>Slide 2</CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
```

## Source

`code/packages/web/ui/src/web/embla-carousel.tsx`
