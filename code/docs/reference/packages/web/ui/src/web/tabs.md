---
title: "Tabs"
description: "Radix tabs primitives with default and line list variants."
status: stable
---

# Tabs

> Radix tabs primitives, with a default or line-style list.

## Purpose

`Tabs` and its siblings are shadcn/ui primitives built on Radix Tabs. They
support horizontal or vertical orientation and two list variants (`default`,
`line`).

## Exports

- `Tabs` — the root; adds an `orientation` prop (default `"horizontal"`).
- `TabsList` — the trigger list; adds a `variant` prop (`"default" | "line"`).
- `TabsTrigger` — one tab trigger.
- `TabsContent` — one tab panel.
- `tabsListVariants` — the cva variants powering `TabsList`.

## Usage

```tsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@indiecrafts/packages-web-ui/web/tabs";

<Tabs defaultValue="a">
  <TabsList>
    <TabsTrigger value="a">A</TabsTrigger>
    <TabsTrigger value="b">B</TabsTrigger>
  </TabsList>
  <TabsContent value="a">Panel A</TabsContent>
  <TabsContent value="b">Panel B</TabsContent>
</Tabs>;
```

## Source

`code/packages/web/ui/src/web/tabs.tsx`
