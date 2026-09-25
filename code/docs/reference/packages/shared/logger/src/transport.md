---
title: "Transport registry"
description: "The transport type and the registry of log sinks that receive every record independent of the console gate."
status: stable
---

# Transport registry

> The list of sinks every log record reaches, whatever the console level.

## Purpose

Defines the `Transport` type and holds the module-level registry of transports. A transport receives every record, independent of the console level gate, so a production-silent console can still forward errors to Sentry, Datadog, or Workers Logs. Each transport self-filters and must never throw.

## Exports

- `Transport` — a sink type with a single `log(record)` method.
- `addTransport(transport)` — register a transport.
- `clearTransports()` — remove all transports, mainly for tests.
- `getTransports()` — the current transports as a readonly array.

## Usage

```ts
import {
  addTransport,
  clearTransports,
} from "@indiecrafts/packages-shared-logger";

addTransport({ log: (record) => queue.push(record) });
clearTransports(); // reset between tests
```

## Source

`code/packages/shared/logger/src/transport.ts`
