---
title: "Toggle"
description: "A two-state toggle button built on Radix, plus its cva style variants."
status: stable
---

# Toggle

> A two-state toggle button and its style variants.

## Purpose

`Toggle` is a shadcn/ui primitive built on Radix Toggle. It renders a button
that switches between on and off states, styled by the shared `toggleVariants`
(`variant`: default/outline; `size`: default/sm/lg).

## Exports

- `Toggle` — the toggle button; forwards Radix `Toggle.Root` props and the `toggleVariants` props.
- `toggleVariants` — the cva definition, reused by `ToggleGroupItem`.

## Usage

```tsx
import { Toggle } from "@indiecrafts/packages-web-ui/web/toggle";

<Toggle variant="outline" size="sm" aria-label="Bold">
  B
</Toggle>;
```

## Source

`code/packages/web/ui/src/web/toggle.tsx`
