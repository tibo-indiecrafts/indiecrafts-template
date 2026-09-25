---
title: "Keyboard key"
description: "Renders a keyboard key hint and a group wrapper for key combinations."
status: stable
---

# Keyboard key

> Inline `<kbd>` styling for keyboard hints, with a group wrapper for combinations.

## Purpose

A shadcn/ui primitive that styles keyboard shortcut hints. `Kbd` renders a single styled key; `KbdGroup` lays out several keys side by side. It carries a variant for use inside a tooltip.

## Exports

- `Kbd` — a styled `<kbd>` element for one key.
- `KbdGroup` — an inline flex wrapper that spaces a set of `Kbd` keys.

## Usage

```tsx
import { Kbd, KbdGroup } from "@indiecrafts/packages-web-ui/web/kbd";

export function SaveHint() {
  return (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>S</Kbd>
    </KbdGroup>
  );
}
```

## Source

`code/packages/web/ui/src/web/kbd.tsx`
