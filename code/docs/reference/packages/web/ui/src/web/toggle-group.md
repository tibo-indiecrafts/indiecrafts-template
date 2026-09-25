---
title: "Toggle group"
description: "A Radix toggle group whose items share variant, size, and spacing via context."
status: stable
---

# Toggle group

> A Radix toggle group that shares variant, size, and spacing with its items.

## Purpose

`ToggleGroup` and `ToggleGroupItem` are shadcn/ui primitives built on Radix
ToggleGroup. The group passes `variant`, `size`, and `spacing` to its items
through React context, so a set of toggles stays visually consistent. Zero
spacing renders the items as a connected segmented control.

## Exports

- `ToggleGroup` — the group root; adds `variant`, `size`, and `spacing` props and provides them via context.
- `ToggleGroupItem` — one toggle; reads the group context, falling back to its own `variant`/`size`.

## Usage

```tsx
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@indiecrafts/packages-web-ui/web/toggle-group";

<ToggleGroup type="single" variant="outline">
  <ToggleGroupItem value="left">Left</ToggleGroupItem>
  <ToggleGroupItem value="center">Center</ToggleGroupItem>
</ToggleGroup>;
```

## Source

`code/packages/web/ui/src/web/toggle-group.tsx`
