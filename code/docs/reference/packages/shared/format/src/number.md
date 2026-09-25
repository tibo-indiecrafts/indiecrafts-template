---
title: "Number formatting"
description: "Locale-aware number, percent, compact, unit, ordinal, and byte-size formatters."
status: stable
---

# Number formatting

> Every numeric display format, memoized per locale.

## Purpose

Wraps `Intl.NumberFormat` (and `Intl.PluralRules` for ordinals) behind small helpers, sharing one memoization cache. Covers plain numbers, percents, compact notation, units, ranges, ordinals, and byte sizes, plus two math helpers.

## Exports

- `formatNumber(n, locale?, opts?)` — locale-aware number formatting.
- `formatPercent(ratio, locale?, decimals?)` — a 0–1 ratio as a percent.
- `formatCompact(n, locale?)` — compact notation, such as `"1.2K"`.
- `formatUnit(n, unit, locale?, unitDisplay?)` — a value with a sanctioned unit.
- `formatRange(a, b, locale?, opts?)` — a formatted numeric range.
- `formatOrdinal(n, locale?)` — ordinal form, such as `"1st"` or `"1er"`.
- `formatBytes(bytes, decimals?)` — binary byte size, such as `"1.5 KB"` (not locale-aware).
- `clamp(n, min, max)` — clamp a number to a range.
- `roundTo(n, decimals?)` — round to a decimal precision.

## Usage

```ts
import {
  formatPercent,
  formatCompact,
  formatOrdinal,
} from "@indiecrafts/packages-shared-format/number";

formatPercent(0.125, "fr", 1); // "12,5 %"
formatCompact(1234, "en"); // "1.2K"
formatOrdinal(1, "en"); // "1st"
```

## Source

`code/packages/shared/format/src/number.ts`
