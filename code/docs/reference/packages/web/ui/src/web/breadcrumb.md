---
title: "Breadcrumb"
description: "shadcn/ui breadcrumb navigation with links, separators, and an ellipsis."
status: stable
---

# Breadcrumb

> An accessible trail showing the current page's location.

## Purpose

A CLI-managed shadcn/ui primitive. It composes a labelled `nav` from links, the current page, separators, and a collapse ellipsis. Do not hand-edit; `shadcn add` regenerates it.

## Exports

- `Breadcrumb` — the `nav` wrapper (`aria-label="breadcrumb"`).
- `BreadcrumbList` — the ordered list.
- `BreadcrumbItem` — one entry.
- `BreadcrumbLink` — a link; supports `asChild`.
- `BreadcrumbPage` — the current page (`aria-current="page"`).
- `BreadcrumbSeparator` — the divider; defaults to a chevron.
- `BreadcrumbEllipsis` — a collapsed-items indicator.

## Usage

```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@indiecrafts/packages-web-ui/web/breadcrumb";

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Blog</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>;
```

## Source

`code/packages/web/ui/src/web/breadcrumb.tsx`
