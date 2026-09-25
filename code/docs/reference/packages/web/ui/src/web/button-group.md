---
title: "Button group"
description: "shadcn/ui container that joins buttons and inputs into one segmented control."
status: stable
---

# Button group

> Joins buttons and inputs into one segmented control.

## Purpose

A CLI-managed shadcn/ui primitive. It joins adjacent buttons, inputs, or selects into a single control by collapsing their shared borders and radii, in a horizontal or vertical orientation. Do not hand-edit; `shadcn add` regenerates it.

## Exports

- `ButtonGroup` — the container; accepts `orientation` of `horizontal` or `vertical`.
- `ButtonGroupText` — an inline label segment; supports `asChild`.
- `ButtonGroupSeparator` — a divider between segments.
- `buttonGroupVariants` — the `cva` class helper.

## Usage

```tsx
import { ButtonGroup } from "@indiecrafts/packages-web-ui/web/button-group";
import { Button } from "@indiecrafts/packages-web-ui/web/button";

<ButtonGroup>
  <Button variant="outline">Left</Button>
  <Button variant="outline">Middle</Button>
  <Button variant="outline">Right</Button>
</ButtonGroup>;
```

## Source

`code/packages/web/ui/src/web/button-group.tsx`
