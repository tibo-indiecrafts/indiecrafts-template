---
title: "Text helpers"
description: "Locale-agnostic string shaping: truncation, initials, excerpts, name and URL formatting."
status: stable
---

# Text helpers

> Plain, locale-agnostic string shaping.

## Purpose

A set of pure string helpers that do not depend on locale rules. Covers truncation, initials, word count, reading time, excerpts, email masking, name formatting, URL prettifying, and file extensions.

## Exports

- `truncate(text, max, ellipsis?)` — trim to a word boundary with an ellipsis.
- `initials(name, max?)` — initials from a name, such as `"AL"`.
- `wordCount(text)` — count whitespace-separated words.
- `readingTime(text, wordsPerMinute?)` — reading time in minutes, at least 1.
- `excerpt(text, max?)` — collapse whitespace and truncate to one line.
- `maskEmail(email)` — mask the local part for display.
- `NameStyle` — name style type: `full`, `lastFirst`, or `initialLast`.
- `nameFormat(name, style?)` — format a first/last name pair.
- `prettyUrl(url)` — host without the `www.` prefix.
- `fileExtension(filename)` — lowercase extension without the dot.

## Usage

```ts
import {
  initials,
  excerpt,
  maskEmail,
} from "@indiecrafts/packages-shared-format/text";

initials("Ada Lovelace"); // "AL"
maskEmail("john.doe@x.com"); // "j***@x.com"
excerpt("A long   paragraph...", 10);
```

## Source

`code/packages/shared/format/src/text.ts`
