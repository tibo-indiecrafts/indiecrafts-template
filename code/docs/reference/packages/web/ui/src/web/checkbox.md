---
title: "Checkbox"
description: "A styled Radix checkbox with a check-mark indicator."
status: stable
---

# Checkbox

> Radix checkbox root wrapped with token-based styling and a `CheckIcon` indicator.

## Purpose

`Checkbox` is a design-system wrapper over the Radix `Checkbox.Root` primitive. It applies the shared border, focus-ring, and checked-state tokens, and renders a `CheckIcon` inside the indicator. It is used wherever a single boolean control is needed in a form.

## Exports

- `Checkbox` — the checkbox control; accepts every Radix `Checkbox.Root` prop (`checked`, `defaultChecked`, `onCheckedChange`, `disabled`).

## Usage

```tsx
import { Checkbox } from "@indiecrafts/packages-web-ui/web/checkbox";

export function TermsField() {
  return <Checkbox defaultChecked aria-label="Accept the terms" />;
}
```

## Source

`code/packages/web/ui/src/web/checkbox.tsx`
