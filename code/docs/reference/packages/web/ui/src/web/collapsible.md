---
title: "Collapsible"
description: "A thin wrapper over the Radix collapsible primitive with data-slot hooks."
status: stable
---

# Collapsible

> Show or hide a region of content behind a trigger, built on Radix `Collapsible`.

## Purpose

`Collapsible` re-exports the Radix collapsible parts with `data-slot` attributes for styling and testing. It adds no visual styling of its own, so consumers control the look through their own classes.

## Exports

- `Collapsible` — the root; controls open state (`open`, `defaultOpen`, `onOpenChange`).
- `CollapsibleTrigger` — the button that toggles the open state.
- `CollapsibleContent` — the region shown or hidden.

## Usage

```tsx
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@indiecrafts/packages-web-ui/web/collapsible";

export function Details() {
  return (
    <Collapsible>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>Hidden content</CollapsibleContent>
    </Collapsible>
  );
}
```

## Source

`code/packages/web/ui/src/web/collapsible.tsx`
