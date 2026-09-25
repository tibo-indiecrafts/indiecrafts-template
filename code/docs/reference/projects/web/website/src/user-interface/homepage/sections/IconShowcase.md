---
title: "Icon showcase section"
description: "Homepage section demonstrating the icon sets shipped by the shared ui-icons brick."
status: stable
---

# Icon showcase section

> Demonstrates the Lucide, Reicon, and brand icon sets the shared `@indiecrafts/packages-shared-ui-icons` brick ships.

## Purpose

Client component in `src/user-interface/homepage/sections`. It renders three icon groups, each doing the job it is best at: Lucide (`Icon`) outline UI glyphs, Reicon (`ReiconIcon`) in Outline and Filled weights, and brand marks (`BrandIcon`) in their official colors. It renders on the client because the Reicon icons are `"use client"`. Copy reads from `namespace`.

## Exports

- `IconShowcase` — React component; props `id`, `namespace`.

## Usage

```tsx
import { IconShowcase } from "@/user-interface/homepage/sections/IconShowcase";

<IconShowcase id="icons" namespace="pages.home.blocks.icons" />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/homepage/sections/IconShowcase.tsx`
