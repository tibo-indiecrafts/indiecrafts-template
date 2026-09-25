---
title: "Table"
description: "A set of table primitives — container, header, body, footer, rows, cells, and caption."
status: stable
---

# Table

> The styled table primitive set, from container to caption.

## Purpose

`Table` and its siblings are shadcn/ui primitives. `Table` wraps a `<table>` in
a horizontally scrollable container; the rest map to the standard table
elements with token-based styling.

## Exports

- `Table` — a `<table>` inside an overflow-x container.
- `TableHeader` — a `<thead>`.
- `TableBody` — a `<tbody>`.
- `TableFooter` — a `<tfoot>`.
- `TableHead` — a `<th>` header cell.
- `TableRow` — a `<tr>` with hover and selected states.
- `TableCell` — a `<td>` data cell.
- `TableCaption` — a `<caption>`.

## Usage

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@indiecrafts/packages-web-ui/web/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Ada</TableCell>
    </TableRow>
  </TableBody>
</Table>;
```

## Source

`code/packages/web/ui/src/web/table.tsx`
