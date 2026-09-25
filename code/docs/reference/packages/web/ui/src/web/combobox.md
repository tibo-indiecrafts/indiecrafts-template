---
title: "Combobox"
description: "A styled autocomplete/select built on the Base UI Combobox primitive."
status: stable
---

# Combobox

> Typeahead select with single value, multi-select chips, groups, and an empty state.

## Purpose

`Combobox` wraps the Base UI `Combobox` primitive with the design-system input group, popover, and item styling. It supports a text input with a dropdown trigger and clear button, grouped and separated items, a filtered empty state, and a chips mode for multi-select.

## Exports

- `Combobox` — the root (alias of the Base UI `Combobox.Root`).
- `ComboboxValue` — renders the current value.
- `ComboboxTrigger` — the dropdown toggle with a chevron icon.
- `ComboboxClear` — clears the current value.
- `ComboboxInput` — the text input inside an input group, with optional trigger and clear.
- `ComboboxContent` — the portalled, positioned popup; accepts `side`, `align`, `sideOffset`, `alignOffset`, `anchor`.
- `ComboboxList` — the scrollable list container.
- `ComboboxItem` — one selectable option with a check indicator.
- `ComboboxGroup` — groups related items.
- `ComboboxLabel` — a group label.
- `ComboboxCollection` — renders a collection of items.
- `ComboboxEmpty` — shown when no item matches.
- `ComboboxSeparator` — a divider between groups.
- `ComboboxChips` — the container for selected chips (multi-select).
- `ComboboxChip` — one selected chip with an optional remove button.
- `ComboboxChipsInput` — the inline input used inside a chips container.
- `useComboboxAnchor` — a ref hook to anchor the content to a chips container.

## Usage

```tsx
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@indiecrafts/packages-web-ui/web/combobox";

export function FruitPicker() {
  return (
    <Combobox items={["Apple", "Pear"]}>
      <ComboboxInput placeholder="Search fruit" showClear />
      <ComboboxContent>
        <ComboboxEmpty>No fruit found</ComboboxEmpty>
        <ComboboxList>
          <ComboboxItem value="Apple">Apple</ComboboxItem>
          <ComboboxItem value="Pear">Pear</ComboboxItem>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
```

## Source

`code/packages/web/ui/src/web/combobox.tsx`
