---
title: "Switch"
description: "A Radix on/off switch toggle with default and small sizes."
status: stable
---

# Switch

> A Radix on/off switch with two sizes.

## Purpose

`Switch` is a shadcn/ui primitive. It wraps Radix `Switch.Root` plus its thumb,
styled from the design tokens, with a `size` prop for `default` or `sm`.

## Exports

- `Switch` — the composed switch; adds a `size` prop (`"sm" | "default"`, default `"default"`) and forwards Radix `Switch.Root` props.

## Usage

```tsx
import { Switch } from "@indiecrafts/packages-web-ui/web/switch";

<Switch size="sm" defaultChecked />;
```

## Source

`code/packages/web/ui/src/web/switch.tsx`
