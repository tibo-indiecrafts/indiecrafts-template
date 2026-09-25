---
title: "Empty state"
description: "Layout slots for an empty-state block with media, title, description, and content."
status: stable
---

# Empty state

> Centered empty-state layout with a dashed border and optional icon media.

## Purpose

The `Empty` components compose a centered empty-state block: a dashed-border container, a header, optional media (plain or a rounded icon tile), a title, a description, and a content area for actions. They are plain styled `div` slots with no behaviour.

## Exports

- `Empty` — the dashed-border container.
- `EmptyHeader` — groups the media, title, and description.
- `EmptyMedia` — the media slot; `variant` is `default` or `icon` (a rounded tile).
- `EmptyTitle` — the heading.
- `EmptyDescription` — supporting text; styles nested links.
- `EmptyContent` — a slot for actions below the header.

## Usage

```tsx
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@indiecrafts/packages-web-ui/web/empty";

export function NoResults() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">📭</EmptyMedia>
        <EmptyTitle>Nothing here yet</EmptyTitle>
        <EmptyDescription>Add your first item to begin.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{/* action button */}</EmptyContent>
    </Empty>
  );
}
```

## Source

`code/packages/web/ui/src/web/empty.tsx`
