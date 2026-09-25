---
title: "Relative time"
description: "Locale-aware relative time, durations, clock time, and date ranges."
status: stable
---

# Relative time

> Human, localized time phrasing built on Intl.

## Purpose

Formats time relative to now, such as `"3 days ago"` or `"il y a 3 jours"`, using a memoized `Intl.RelativeTimeFormat` with cascading divisions. Also formats minute durations, clock time, and date ranges.

## Exports

- `formatRelativeTime(input, locale?, now?)` — localized relative time from a Date, ISO string, or epoch; `now` is overridable for tests.
- `formatDuration(minutes, locale?)` — minutes as a short unit, such as `"5 min"`.
- `formatClock(totalSeconds)` — seconds as clock time, such as `"1:23:45"`.
- `formatDateRange(a, b, locale?, opts?)` — a localized date range via `Intl.DateTimeFormat.formatRange`.

## Usage

```ts
import {
  formatRelativeTime,
  formatClock,
} from "@indiecrafts/packages-shared-format/relative";

formatRelativeTime(Date.now() - 3 * 86400000, "en"); // "3 days ago"
formatClock(3845); // "1:04:05"
```

## Source

`code/packages/shared/format/src/relative.ts`
