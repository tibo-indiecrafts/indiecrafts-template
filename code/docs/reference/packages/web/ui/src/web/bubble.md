---
title: "Bubble"
description: "shadcn/ui chat-style message bubble with variants, alignment, and reactions."
status: stable
---

# Bubble

> A chat-style message bubble with variants, alignment, and reactions.

## Purpose

A CLI-managed shadcn/ui primitive. It builds a message bubble from content and reaction slots, with color variants, start/end alignment, and a positioned reactions cluster. `BubbleGroup` stacks a run of bubbles. Do not hand-edit; `shadcn add` regenerates it.

## Exports

- `BubbleGroup` — a vertical stack of bubbles.
- `Bubble` — the bubble container; accepts `variant` (`default`, `secondary`, `muted`, `tinted`, `outline`, `ghost`, `destructive`) and `align` of `start` or `end`.
- `BubbleContent` — the message body; supports `asChild`.
- `BubbleReactions` — a reactions cluster; accepts `side` (`top`, `bottom`) and `align` (`start`, `end`).

## Usage

```tsx
import { Bubble, BubbleContent } from "@indiecrafts/packages-web-ui/web/bubble";

<Bubble variant="default" align="end">
  <BubbleContent>See you at noon.</BubbleContent>
</Bubble>;
```

## Source

`code/packages/web/ui/src/web/bubble.tsx`
