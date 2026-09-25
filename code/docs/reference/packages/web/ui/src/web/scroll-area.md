---
title: "Scroll area"
description: "A custom-styled scroll container built on the Radix ScrollArea primitive."
status: stable
---

# Scroll area

> A scroll container with a thin, themed scrollbar in place of the native one.

## Purpose

A shadcn/ui primitive wrapping the Radix ScrollArea. It replaces the native scrollbar with a styled thumb and track, keeping keyboard focus and overflow behaviour intact.

## Exports

- `ScrollArea` — the root container with a viewport and vertical scrollbar.
- `ScrollBar` — a scrollbar; takes `orientation` (`vertical` | `horizontal`).

## Usage

```tsx
import { ScrollArea } from "@indiecrafts/packages-web-ui/web/scroll-area";

export function TagList({ tags }: { tags: string[] }) {
  return (
    <ScrollArea className="h-48 w-64 rounded-md border">
      <div className="p-4">
        {tags.map((tag) => (
          <div key={tag}>{tag}</div>
        ))}
      </div>
    </ScrollArea>
  );
}
```

## Source

`code/packages/web/ui/src/web/scroll-area.tsx`
