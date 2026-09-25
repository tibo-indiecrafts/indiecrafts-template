---
title: "Item"
description: "Composable list-item slots with media, content, actions, and variants."
status: stable
---

# Item

> A flexible row primitive for lists and cards, with media, title, description, actions, and grouping.

## Purpose

The `Item` components build a single row — media on the left, a content column, and actions on the right — plus header and footer slots that span the full width. `Item` supports `variant` and `size` styling and can render as a child element via `asChild`. `ItemGroup` and `ItemSeparator` arrange stacked items.

## Exports

- `Item` — the row container; `variant` is `default`, `outline`, or `muted`, `size` is `default` or `sm`, and `asChild` swaps the element.
- `ItemMedia` — the leading media slot; `variant` is `default`, `icon`, or `image`.
- `ItemContent` — the main content column.
- `ItemActions` — the trailing actions slot.
- `ItemGroup` — a list wrapper for stacked items.
- `ItemSeparator` — a horizontal divider between items.
- `ItemTitle` — the item title.
- `ItemDescription` — supporting text (clamped to two lines).
- `ItemHeader` — a full-width header row.
- `ItemFooter` — a full-width footer row.

## Usage

```tsx
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@indiecrafts/packages-web-ui/web/item";

export function FileRow() {
  return (
    <Item variant="outline">
      <ItemMedia variant="icon">📄</ItemMedia>
      <ItemContent>
        <ItemTitle>Report.pdf</ItemTitle>
        <ItemDescription>2.4 MB</ItemDescription>
      </ItemContent>
      <ItemActions>{/* menu button */}</ItemActions>
    </Item>
  );
}
```

## Source

`code/packages/web/ui/src/web/item.tsx`
