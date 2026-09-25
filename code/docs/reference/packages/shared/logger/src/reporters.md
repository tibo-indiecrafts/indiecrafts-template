---
title: "Log reporters"
description: "Console reporters that render logger records for dev, browser, and production."
status: stable
---

# Log reporters

> Render a log record to the console for dev, browser, and production.

## Purpose

Provides the three console reporters the shared logger auto-selects by environment. Each reporter takes one `LogRecord` and writes it to the matching `console` method, so Cloudflare Workers Logs classifies severity correctly. It also maps each level to a `console` method and colors output only on a non-browser TTY that has not opted out via `NO_COLOR`.

## Exports

- `Reporter` — the reporter type: a function that renders one `LogRecord` to the console.
- `prettyReporter` — human dev reporter: colored level badge, dim time, dim scope, message, and context.
- `browserReporter` — browser reporter using a CSS-styled `%c` badge plus the record.
- `jsonReporter` — production and Workers reporter: one structured JSON line per record.

## Usage

```ts
import { configure } from "@indiecrafts/packages-shared-logger";
import { jsonReporter } from "@indiecrafts/packages-shared-logger/reporters";

configure({ reporter: jsonReporter });
```

## Source

`code/packages/shared/logger/src/reporters.ts`
