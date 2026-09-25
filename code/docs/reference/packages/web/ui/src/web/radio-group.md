---
title: "Radio group"
description: "A set of mutually exclusive radio options built on the Radix RadioGroup primitive."
status: stable
---

# Radio group

> A group of radio buttons where only one option is selected.

## Purpose

A shadcn/ui primitive wrapping the Radix RadioGroup. It lays out radio items in a grid and styles each item's selected indicator, focus ring, and invalid state.

## Exports

- `RadioGroup` — the group container; manages the selected `value`.
- `RadioGroupItem` — a single radio option; needs a unique `value`.

## Usage

```tsx
import {
  RadioGroup,
  RadioGroupItem,
} from "@indiecrafts/packages-web-ui/web/radio-group";
import { Label } from "@indiecrafts/packages-web-ui/web/label";

export function PlanPicker() {
  return (
    <RadioGroup defaultValue="monthly">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="monthly" id="monthly" />
        <Label htmlFor="monthly">Monthly</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="yearly" id="yearly" />
        <Label htmlFor="yearly">Yearly</Label>
      </div>
    </RadioGroup>
  );
}
```

## Source

`code/packages/web/ui/src/web/radio-group.tsx`
