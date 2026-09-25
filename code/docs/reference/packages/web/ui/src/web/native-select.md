---
title: "Native select"
description: "A styled wrapper around the native HTML select element."
status: stable
---

# Native select

> The browser's own `<select>`, styled to match the design system with a chevron icon.

## Purpose

A shadcn/ui primitive that keeps the native `<select>` element — for full mobile and accessibility support — while applying the design-system border, focus ring, and a decorative chevron. Use it where the platform select is preferable to the custom `Select` primitive.

## Exports

- `NativeSelect` — the styled `<select>` with wrapper and chevron; takes `size` (`sm` | `default`).
- `NativeSelectOption` — a styled `<option>`.
- `NativeSelectOptGroup` — a styled `<optgroup>`.

## Usage

```tsx
import {
  NativeSelect,
  NativeSelectOption,
} from "@indiecrafts/packages-web-ui/web/native-select";

export function CountrySelect() {
  return (
    <NativeSelect defaultValue="fr">
      <NativeSelectOption value="fr">France</NativeSelectOption>
      <NativeSelectOption value="de">Germany</NativeSelectOption>
    </NativeSelect>
  );
}
```

## Source

`code/packages/web/ui/src/web/native-select.tsx`
