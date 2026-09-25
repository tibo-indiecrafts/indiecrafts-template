---
title: "Title highlight parser"
description: "Splits a title string into plain and highlighted segments on the [[word]] marker."
status: stable
---

# Title highlight parser

> The platform-agnostic half of `RichTitle` — turns `[[word]]` markers into segments.

## Purpose

This module splits a title string into ordered plain and highlighted segments
on the `[[word]]` marker. The marker is safe inside next-intl/ICU messages and
Sanity strings, so one parser serves both the app and the CMS. A title with no
marker yields a single plain segment, so wrapping an existing title is a no-op.

## Exports

- `TitleSegment` — a segment type: `{ text: string; highlight: boolean }`.
- `splitHighlights(input)` — splits a string into an ordered `TitleSegment[]`. Unmatched or empty markers render as literal text and never throw.

## Usage

```ts
import { splitHighlights } from "@indiecrafts/packages-web-ui-components/shared/rich-title";

const segments = splitHighlights("Build [[fast]] sites");
// [{ text: "Build ", highlight: false },
//  { text: "fast", highlight: true },
//  { text: " sites", highlight: false }]
```

## Source

`code/packages/web/ui-components/src/shared/rich-title.ts`
