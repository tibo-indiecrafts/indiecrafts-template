---
title: "Cloudflare transport"
description: "A logger transport that forwards error and fatal records to Cloudflare Workers Logs."
status: stable
---

# Cloudflare transport

> Keep errors visible in Workers Logs even when the console is silent.

## Purpose

Provides a transport that forwards `error` and `fatal` records to Cloudflare Workers Logs as one structured JSON line, reusing the production `jsonReporter`. Transports fire independently of the console level gate, so errors still reach Workers Logs when production sets the console to `silent`. This is the Cloudflare-native counterpart to the Sentry transport, with no vendor SDK.

## Exports

- `cloudflareTransport()` — build a `Transport` that JSON-reports only `error` and `fatal` records.

## Usage

```ts
import { addTransport } from "@indiecrafts/packages-shared-logger";
import { cloudflareTransport } from "@indiecrafts/packages-shared-logger/cloudflare";
import { getCurrentEnvironment } from "@indiecrafts/packages-shared-config";

if (getCurrentEnvironment() === "production") {
  addTransport(cloudflareTransport());
}
```

## Source

`code/packages/shared/logger/src/cloudflare.ts`
