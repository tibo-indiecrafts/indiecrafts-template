---
title: "List formatting"
description: "Locale-aware list joining and truncation via Intl.ListFormat."
status: stable
---

# List formatting

> Join strings into a natural-language list per locale.

## Purpose

Formats an array of strings into a locale-aware list, such as `"A, B and C"` or `"A, B et C"`, using a memoized `Intl.ListFormat`. It also offers a truncated join with an overflow marker for compact UI.

## Exports

- `ListOptions` — options type: `type` (`conjunction` / `disjunction` / `unit`) and `style` (`long` / `short` / `narrow`).
- `formatList(items, locale?, options?)` — join non-empty items into a localized list.
- `joinTruncated(items, locale?, max?)` — join the first `max` items, then append a `+N` overflow marker.

## Usage

```ts
import {
  formatList,
  joinTruncated,
} from "@indiecrafts/packages-shared-format/list";

formatList(["A", "B", "C"], "fr"); // "A, B et C"
joinTruncated(["A", "B", "C", "D", "E"], "en", 3); // "A, B, C +2"
```

## Source

`code/packages/shared/format/src/list.ts`
