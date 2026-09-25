---
title: "Input group"
description: "A wrapper that composes an input or textarea with inline or block addons."
status: stable
---

# Input group

> Group an input or textarea with icons, text, buttons, or keyboard hints on any edge.

## Purpose

The `InputGroup` components frame a control and place addons at the inline-start, inline-end, block-start, or block-end. `InputGroupInput` and `InputGroupTextarea` are the borderless controls that sit inside the group, which owns the border, focus ring, and invalid state.

## Exports

- `InputGroup` — the bordered container; forwards focus to its input on click.
- `InputGroupAddon` — an addon slot; `align` is `inline-start`, `inline-end`, `block-start`, or `block-end`.
- `InputGroupButton` — a button sized for the group; `size` is `xs`, `sm`, `icon-xs`, or `icon-sm`.
- `InputGroupText` — inline muted text or icons.
- `InputGroupInput` — the borderless input control.
- `InputGroupTextarea` — the borderless textarea control.

## Usage

```tsx
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupText,
} from "@indiecrafts/packages-web-ui/web/input-group";

export function AmountInput() {
  return (
    <InputGroup>
      <InputGroupAddon align="inline-start">
        <InputGroupText>$</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="0.00" />
    </InputGroup>
  );
}
```

## Source

`code/packages/web/ui/src/web/input-group.tsx`
