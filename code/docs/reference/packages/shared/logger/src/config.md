---
title: "Logger configuration"
description: "Resolves the logger level, reporter, and redaction keys from overrides, env, and per-env config."
status: stable
---

# Logger configuration

> The precedence rules that decide how the logger behaves at runtime.

## Purpose

Resolves the active console level, reporter, and redaction keys. Precedence is runtime overrides, then the `NEXT_PUBLIC_LOG_LEVEL` env var, then the per-environment config default. It also lets an edge entry force the environment, because `process.env` is unreliable at edge module-load time.

## Exports

- `setEnvironment(env)` — force the environment for later resolution.
- `configure(opts)` — set runtime overrides for `level`, `reporter`, and `redactKeys`.
- `resolveConsoleLevel()` — the active minimum console level.
- `resolveRedactKeys()` — the keys to redact from context.
- `resolveReporter()` — the active console reporter.

## Usage

```ts
import { configure, setEnvironment } from "@indiecrafts/packages-shared-logger";

setEnvironment("production");
configure({ level: "debug" }); // crank the level while chasing a bug
```

## Source

`code/packages/shared/logger/src/config.ts`
