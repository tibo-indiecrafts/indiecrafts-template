---
title: "Select"
description: "A styled dropdown select built on the Radix Select primitive."
status: stable
---

# Select

> A custom dropdown for choosing one value from a list.

## Purpose

A shadcn/ui primitive wrapping the Radix Select. It renders a trigger showing the current value and a portalled, scrollable list of items with a check indicator, grouped labels, and separators.

## Exports

- `Select` — the root state container.
- `SelectGroup` — groups related items.
- `SelectValue` — displays the selected value in the trigger.
- `SelectTrigger` — the button that opens the list; takes `size` (`sm` | `default`).
- `SelectContent` — the portalled dropdown panel.
- `SelectLabel` — a group label.
- `SelectItem` — one selectable option; needs a `value`.
- `SelectSeparator` — a divider between items.
- `SelectScrollUpButton` / `SelectScrollDownButton` — scroll controls for long lists.

## Usage

```tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@indiecrafts/packages-web-ui/web/select";

export function FruitSelect() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Pick one" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="pear">Pear</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

## Source

`code/packages/web/ui/src/web/select.tsx`
