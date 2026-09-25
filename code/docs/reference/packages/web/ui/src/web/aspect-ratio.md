---
title: "Aspect ratio"
description: "shadcn/ui wrapper that constrains its content to a fixed width-to-height ratio."
status: stable
---

# Aspect ratio

> Holds content at a fixed width-to-height ratio.

## Purpose

A CLI-managed shadcn/ui primitive that re-exports Radix AspectRatio with a `data-slot`. Use it to keep images or embeds at a chosen ratio while they resize. Do not hand-edit; `shadcn add` regenerates it.

## Exports

- `AspectRatio` — the Radix root; pass `ratio` (e.g. `16 / 9`) and place the constrained content inside.

## Usage

```tsx
import { AspectRatio } from "@indiecrafts/packages-web-ui/web/aspect-ratio";

<AspectRatio ratio={16 / 9}>
  <img src="/cover.jpg" alt="" className="h-full w-full object-cover" />
</AspectRatio>;
```

## Source

`code/packages/web/ui/src/web/aspect-ratio.tsx`
