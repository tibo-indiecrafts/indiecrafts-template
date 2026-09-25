---
title: "Progress bar"
description: "A determinate progress bar built on the Radix Progress primitive."
status: stable
---

# Progress bar

> A horizontal bar that fills to a percentage value.

## Purpose

A shadcn/ui primitive wrapping the Radix Progress. It renders a track and an indicator that translates to show the `value` (0–100) as a filled percentage.

## Exports

- `Progress` — the progress bar; takes `value` (a number from 0 to 100).

## Usage

```tsx
import { Progress } from "@indiecrafts/packages-web-ui/web/progress";

export function UploadBar() {
  return <Progress value={64} />;
}
```

## Source

`code/packages/web/ui/src/web/progress.tsx`
