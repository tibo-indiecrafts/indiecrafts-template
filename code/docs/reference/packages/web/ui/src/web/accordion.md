---
title: "Accordion"
description: "shadcn/ui accordion primitive built on Radix for collapsible sections."
status: stable
---

# Accordion

> Vertically stacked, collapsible sections built on Radix.

## Purpose

A CLI-managed shadcn/ui primitive. It wraps Radix Accordion with the design-system slots and styling, exposing header, trigger, and content parts. Do not hand-edit; `shadcn add` regenerates it.

## Exports

- `Accordion` — the Radix root.
- `AccordionItem` — one collapsible section.
- `AccordionTrigger` — the toggle button, with a rotating chevron.
- `AccordionContent` — the revealed panel.

## Usage

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@indiecrafts/packages-web-ui/web/accordion";

<Accordion type="single" collapsible>
  <AccordionItem value="a">
    <AccordionTrigger>Question</AccordionTrigger>
    <AccordionContent>Answer</AccordionContent>
  </AccordionItem>
</Accordion>;
```

## Source

`code/packages/web/ui/src/web/accordion.tsx`
