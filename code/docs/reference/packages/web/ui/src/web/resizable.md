---
title: "Resizable panels"
description: "Draggable split panels built on the react-resizable-panels library."
status: stable
---

# Resizable panels

> Horizontal or vertical split layouts the user can resize by dragging a handle.

## Purpose

A shadcn/ui primitive wrapping `react-resizable-panels`. It arranges panels in a group that flows horizontally or vertically, separated by a draggable handle with an optional grip affordance.

## Exports

- `ResizablePanelGroup` — the container; flows by its `direction`.
- `ResizablePanel` — one resizable region.
- `ResizableHandle` — the drag handle between panels; takes `withHandle` to show a grip.

## Usage

```tsx
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@indiecrafts/packages-web-ui/web/resizable";

export function SplitView() {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30}>Sidebar</ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>Main</ResizablePanel>
    </ResizablePanelGroup>
  );
}
```

## Source

`code/packages/web/ui/src/web/resizable.tsx`
