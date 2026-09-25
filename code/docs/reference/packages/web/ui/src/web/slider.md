---
title: "Slider"
description: "A Radix-based range slider with track, range fill, and one thumb per value."
status: stable
---

# Slider

> A range slider built on the Radix slider primitive.

## Purpose

`Slider` is a shadcn/ui primitive. It wraps Radix `Slider.Root` and renders a
track, a range fill, and one thumb for each value. It supports single or
multiple values and horizontal or vertical orientation.

## Exports

- `Slider` — the composed slider; derives thumb count from `value` or `defaultValue` (falls back to `[min, max]`), defaults `min` to `0` and `max` to `100`, and forwards Radix `Slider.Root` props.

## Usage

```tsx
import { Slider } from "@indiecrafts/packages-web-ui/web/slider";

<Slider defaultValue={[50]} min={0} max={100} />;
```

## Source

`code/packages/web/ui/src/web/slider.tsx`
