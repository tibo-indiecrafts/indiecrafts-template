---
title: "Form label"
description: "Accessible form label built on the Radix Label primitive."
status: stable
---

# Form label

> A styled, accessible label that binds to a form control.

## Purpose

A shadcn/ui primitive wrapping the Radix `Label` root. It applies the design-system text style and dims the label when its associated control is disabled.

## Exports

- `Label` — a styled label element that forwards all Radix Label props, including `htmlFor`.

## Usage

```tsx
import { Label } from "@indiecrafts/packages-web-ui/web/label";
import { Input } from "@indiecrafts/packages-web-ui/web/input";

export function EmailField() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" />
    </div>
  );
}
```

## Source

`code/packages/web/ui/src/web/label.tsx`
