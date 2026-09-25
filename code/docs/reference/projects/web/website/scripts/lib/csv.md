---
title: "CSV cell escaping"
description: "Escapes one CSV cell with RFC 4180 quoting and a spreadsheet formula-injection guard."
status: stable
---

# CSV cell escaping

> The shared cell escaper behind every dataset export script.

## Purpose

Shared helper for the dataset export scripts (contact, subscribers, comments, waitlist). It does two jobs in one: a formula-injection guard that prefixes a single quote on any value starting with `= + - @`, tab, or CR so a spreadsheet treats it as text (OWASP CSV injection); and RFC 4180 quoting that wraps the value in double quotes and doubles inner quotes when it contains a quote, comma, or newline.

## Exports

- `csvCell(value)` — returns the escaped string for one CSV field. `null` and `undefined` become an empty cell.

## Usage

```js
import { csvCell } from "./lib/csv.mjs";

const line = FIELDS.map((f) => csvCell(row[f])).join(",");
```

## Source

`code/projects/web/surfaces/website/scripts/lib/csv.mjs`
