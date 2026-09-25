---
title: "Command palette"
description: "A styled command menu built on cmdk, with an optional dialog wrapper."
status: stable
---

# Command palette

> Searchable command list from `cmdk`, usable inline or inside a dialog.

## Purpose

`Command` wraps the `cmdk` primitive with the design-system popover styling. It provides a search input, grouped and separated items, an empty state, and a keyboard-shortcut label. `CommandDialog` mounts the same list inside a `Dialog` for a command-palette experience.

## Exports

- `Command` — the root list container.
- `CommandDialog` — mounts `Command` inside a dialog; accepts `title`, `description`, `showCloseButton`.
- `CommandInput` — the search input with a search icon.
- `CommandList` — the scrollable results container.
- `CommandEmpty` — shown when no result matches.
- `CommandGroup` — a labelled group of items.
- `CommandItem` — one selectable command.
- `CommandShortcut` — a right-aligned keyboard-shortcut label.
- `CommandSeparator` — a divider between groups.

## Usage

```tsx
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@indiecrafts/packages-web-ui/web/command";

export function Palette({ open }: { open: boolean }) {
  return (
    <CommandDialog open={open}>
      <CommandInput placeholder="Type a command" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem>New file</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
```

## Source

`code/packages/web/ui/src/web/command.tsx`
