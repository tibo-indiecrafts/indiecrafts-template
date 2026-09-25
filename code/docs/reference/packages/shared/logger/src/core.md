---
title: "Log record core"
description: "The log record shape, level weights, and the sanitizing serializers shared by every reporter and transport."
status: stable
---

# Log record core

> The data types and safe serializers at the center of the logger.

## Purpose

Defines the structured `LogRecord` shape, the numeric level weights, and the sanitizing serializers that run at source. Sanitization is depth-, array-, and circular-safe and redacts matching keys, so logging never crashes the request.

## Exports

- `LogLevel` — re-exported log level type.
- `EmitLevel` — levels that emit (every level except `silent`).
- `LEVEL_WEIGHT` — numeric severity per level; higher is more severe.
- `NormalizedError` — a plain, serializable error shape.
- `LogRecord` — one structured log event.
- `normalizeError(err)` — normalize any thrown value into `NormalizedError`.
- `sanitize(value, redactKeys?, depth?, seen?)` — deep clone into JSON-safe values with redaction.
- `safeStringify(value, redactKeys?)` — sanitize then stringify, never throwing.

## Usage

```ts
import {
  safeStringify,
  normalizeError,
} from "@indiecrafts/packages-shared-logger";

const line = safeStringify({ user: { token: "secret" } }, ["token"]);
const err = normalizeError(new Error("boom"));
```

## Source

`code/packages/shared/logger/src/core.ts`
