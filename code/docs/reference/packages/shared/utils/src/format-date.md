---
title: "Localized date formatter"
description: "Formats a post's publish date for a locale, reusing one cached Intl formatter per locale and style."
status: stable
---

# Localized date formatter

> A locale-aware date formatter that caches one `Intl.DateTimeFormat` per locale and style.

## Purpose

`new Intl.DateTimeFormat()` allocates locale-data tables on every construction, which is wasteful when it runs per render or per list item. This module builds one formatter per (locale, style) and reuses it.

## Exports

- `formatDate(locale, iso?, options?)` — formats an ISO date for a locale (for example `"Jul 14, 2026"`), or returns `null` when there is no date. Pass `month: "long"` for the fuller `"July 14, 2026"`.

## Usage

```ts
import { formatDate } from "@indiecrafts/packages-shared-utils/format-date";

formatDate("en", post.publishedAt);
// "Jul 14, 2026"

formatDate("fr", post.publishedAt, { month: "long" });
// "14 juillet 2026"
```

## Source

`code/packages/shared/utils/src/format-date.ts`
