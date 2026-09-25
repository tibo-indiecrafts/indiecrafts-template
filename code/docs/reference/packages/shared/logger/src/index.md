---
title: "Logger entry"
description: "Package entry that re-exports the logger, transports, config, and core serializers."
status: stable
---

# Logger entry

> The one import surface for the logging package.

## Purpose

The package entry of `@indiecrafts/packages-shared-logger`. It re-exports the logger factory, transport registration, runtime config, and the core serializers and types.

## Exports

- `logger`, `createLogger` — the root logger and the scoped logger factory.
- `Logger`, `LogContext` — logger and context types.
- `addTransport`, `clearTransports`, `Transport` — transport registration and its type.
- `configure`, `setEnvironment` — runtime configuration.
- `safeStringify`, `normalizeError` — core serializers.
- `LogLevel`, `LogRecord`, `NormalizedError` — core types.

## Usage

```ts
import { logger } from "@indiecrafts/packages-shared-logger";

logger.info("started");
logger.child("newsletter").warn("retrying", { attempt: 2 });
```

## Source

`code/packages/shared/logger/src/index.ts`
