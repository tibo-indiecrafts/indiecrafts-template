---
title: "Logger factory"
description: "Creates scoped structured loggers and the application-wide root logger."
status: stable
---

# Logger factory

> Scoped, structured loggers that split console output from transports.

## Purpose

Builds the structured logger. Each call is dispatched to the console when it passes the level gate, and to every transport independently. That split keeps the production console silent while transports still feed a sink. Loggers carry a scope and base context, and `child` extends both.

## Exports

- `LogContext` — a record of context values attached to a log call.
- `Logger` — the logger type: `trace`, `debug`, `info`, `warn`, `error`, `fatal`, `child`, `time`, `timeEnd`.
- `createLogger(scope?, baseContext?)` — build a scoped logger.
- `logger` — the application-wide root logger.

## Usage

```ts
import { createLogger } from "@indiecrafts/packages-shared-logger";

const log = createLogger("checkout", { orderId: "123" });
log.info("started");
log.error("failed", new Error("boom"), { step: "payment" });
```

## Source

`code/packages/shared/logger/src/logger.ts`
