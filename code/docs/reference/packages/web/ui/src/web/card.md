---
title: "Card"
description: "shadcn/ui surface with header, title, description, action, content, and footer slots."
status: stable
---

# Card

> A bordered surface composed from header, content, and footer slots.

## Purpose

A CLI-managed shadcn/ui primitive. It builds a bordered, padded surface from slot parts — header (with title, description, and a corner action), content, and footer. Do not hand-edit; `shadcn add` regenerates it.

## Exports

- `Card` — the outer surface.
- `CardHeader` — the header grid.
- `CardTitle`, `CardDescription` — the heading and subtext.
- `CardAction` — a top-right action slot in the header.
- `CardContent` — the body.
- `CardFooter` — the footer row.

## Usage

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@indiecrafts/packages-web-ui/web/card";

<Card>
  <CardHeader>
    <CardTitle>Plan</CardTitle>
    <CardDescription>Monthly billing</CardDescription>
  </CardHeader>
  <CardContent>Everything you need to launch.</CardContent>
  <CardFooter>Cancel anytime.</CardFooter>
</Card>;
```

## Source

`code/packages/web/ui/src/web/card.tsx`
