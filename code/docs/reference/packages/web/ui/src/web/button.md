---
title: "Button"
description: "shadcn/ui button with color variants and sizes, renderable as any element."
status: stable
---

# Button

> The base button, with color variants and sizes.

## Purpose

A CLI-managed shadcn/ui primitive. It renders a styled button with color variants and sizes (including icon sizes), and can render as its child via `asChild` (for links or other elements). Do not hand-edit; `shadcn add` regenerates it.

## Exports

- `Button` — the button; accepts `variant` (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`), `size` (`default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`), and `asChild`.
- `buttonVariants` — the `cva` class helper, used by other primitives to reuse the button styles.

## Usage

```tsx
import { Button } from "@indiecrafts/packages-web-ui/web/button";

<Button variant="default" size="lg">
  Save
</Button>;
```

## Source

`code/packages/web/ui/src/web/button.tsx`
