---
title: "Stat list"
description: "Renders a hairline-divided grid of label and value statistics."
status: stable
---

# Stat list

> A grid of labelled statistics.

## Purpose

Renders a `module.stat-list` block: a hairline-divided card grid of statistics. Each cell shows a label on top and a value below in tabular numerals. Columns and padding key off the container width, not the viewport. It renders nothing with no stats.

## Exports

- `StatList` — a hairline-divided grid of label and value statistics.

## Usage

```tsx
import { StatList } from "@indiecrafts/packages-web-ui-components/web/collection/StatList";

<StatList {...module} />;
```

## Source

`code/packages/web/ui-components/src/web/collection/StatList.tsx`
