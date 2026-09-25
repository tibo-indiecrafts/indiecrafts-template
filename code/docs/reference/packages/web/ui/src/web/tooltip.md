---
title: "Tooltip"
description: "Radix tooltip primitives — provider, root, trigger, and portalled content."
status: stable
---

# Tooltip

> Radix tooltip primitives, with a zero-delay default and portalled content.

## Purpose

`Tooltip` and its siblings are shadcn/ui primitives built on Radix Tooltip.
`TooltipProvider` defaults `delayDuration` to `0`; `TooltipContent` renders in a
portal with an arrow and enter/exit animations.

## Exports

- `TooltipProvider` — the provider; defaults `delayDuration` to `0`.
- `Tooltip` — the tooltip root.
- `TooltipTrigger` — the trigger element.
- `TooltipContent` — the portalled, styled content with an arrow.

## Usage

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@indiecrafts/packages-web-ui/web/tooltip";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover</TooltipTrigger>
    <TooltipContent>Details</TooltipContent>
  </Tooltip>
</TooltipProvider>;
```

## Source

`code/packages/web/ui/src/web/tooltip.tsx`
