---
title: "Morphicons showcase section"
description: "Homepage demo of Morphicons SVG icons that morph between two related shapes on tap."
status: stable
---

# Morphicons showcase section

> SVG icons that mathematically morph from one shape to another; each tile toggles between two related icons on click or tap.

## Purpose

Client component in `src/user-interface/homepage/sections`. It shows a grid of tiles, each morphing between a pair of related icons when pressed — changing `MorphIcon`'s `icon` prop is the whole trigger. It is SSR-safe (the server emits the static SVG) and degrades to an instant swap under `prefers-reduced-motion`. Icons come from `lucide` as raw data (not `lucide-react` components); copy reads from `namespace`.

## Exports

- `MorphiconsShowcase` — React component; props `id`, `namespace`.

## Usage

```tsx
import { MorphiconsShowcase } from "@/user-interface/homepage/sections/MorphiconsShowcase";

<MorphiconsShowcase id="morphicons" namespace="pages.home.blocks.morphicons" />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/homepage/sections/MorphiconsShowcase.tsx`
