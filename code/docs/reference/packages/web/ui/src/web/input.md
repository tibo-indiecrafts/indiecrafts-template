---
title: "Input"
description: "A styled text input with focus-ring and invalid-state tokens."
status: stable
---

# Input

> The base text input, styling a native `input` element with design-system tokens.

## Purpose

`Input` is a thin wrapper over the native `input` element. It applies the shared border, placeholder, focus-ring, file-input, disabled, and `aria-invalid` styling and forwards every native input prop.

## Exports

- `Input` — the text input; accepts every native `input` prop (`type`, `value`, `placeholder`, `disabled`).

## Usage

```tsx
import { Input } from "@indiecrafts/packages-web-ui/web/input";

export function SearchBox() {
  return <Input type="search" placeholder="Search" />;
}
```

## Source

`code/packages/web/ui/src/web/input.tsx`
