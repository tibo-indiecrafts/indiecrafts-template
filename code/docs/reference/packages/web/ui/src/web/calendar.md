---
title: "Calendar"
description: "shadcn/ui date picker built on react-day-picker with themed navigation and days."
status: stable
---

# Calendar

> A themed date picker built on react-day-picker.

## Purpose

A CLI-managed shadcn/ui primitive that wraps `react-day-picker` (`DayPicker`) with the design-system class names, chevron icons, a caption/dropdown layout, and range styling. Day cells render through the design-system `Button`. Do not hand-edit; `shadcn add` regenerates it.

## Exports

- `Calendar` — the picker; forwards `DayPicker` props plus `buttonVariant` for the nav buttons.
- `CalendarDayButton` — the per-day button, used as the `DayButton` component.

## Usage

```tsx
import { Calendar } from "@indiecrafts/packages-web-ui/web/calendar";

<Calendar mode="single" selected={date} onSelect={setDate} />;
```

## Source

`code/packages/web/ui/src/web/calendar.tsx`
