---
title: "Pagination"
description: "Page navigation controls with previous, next, page links, and ellipsis."
status: stable
---

# Pagination

> Accessible page navigation composed from link slots.

## Purpose

A shadcn/ui primitive for paged navigation. It renders a labelled `<nav>` with a list of page links, previous and next controls, and an ellipsis for skipped ranges. Links are styled with `buttonVariants`, and the active page is marked with `aria-current`.

## Exports

- `Pagination` — the `<nav>` container.
- `PaginationContent` — the list wrapper.
- `PaginationItem` — one list item.
- `PaginationLink` — a page link; takes `isActive` and `size`.
- `PaginationPrevious` — the previous-page link.
- `PaginationNext` — the next-page link.
- `PaginationEllipsis` — a skipped-range indicator.

## Usage

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@indiecrafts/packages-web-ui/web/pagination";

export function Pager() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="?page=1" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=2" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="?page=3" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
```

## Source

`code/packages/web/ui/src/web/pagination.tsx`
