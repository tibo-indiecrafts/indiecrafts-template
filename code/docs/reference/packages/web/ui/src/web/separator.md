---
title: "Separator"
description: "A horizontal or vertical divider built on the Radix Separator primitive."
status: stable
---

# Separator

> A thin divider line between content, in either orientation.

## Purpose

A shadcn/ui primitive wrapping the Radix Separator. It draws a one-pixel divider that spans full width when horizontal or full height when vertical, and is decorative by default.

## Exports

- `Separator` — the divider; takes `orientation` (`horizontal` | `vertical`) and `decorative`.

## Usage

```tsx
import { Separator } from "@indiecrafts/packages-web-ui/web/separator";

export function Meta() {
  return (
    <div className="flex h-5 items-center gap-3">
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Source</span>
    </div>
  );
}
```

## Source

`code/packages/web/ui/src/web/separator.tsx`
