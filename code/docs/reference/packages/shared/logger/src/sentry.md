---
title: "Sentry transport"
description: "A logger transport that forwards errors to Sentry as exceptions and lower levels as breadcrumbs."
status: stable
---

# Sentry transport

> Feed Sentry from the logger without any `@sentry/*` dependency.

## Purpose

Provides an opt-in transport that forwards `error` and `fatal` records to Sentry as exceptions and lower levels as breadcrumbs. It depends only on a structural `SentryLike` type, so this file imports nothing from `@sentry/*`; the caller passes the real Sentry object at wire-up. Because the console gate is independent of transports, it still fires when the production console is silent.

## Exports

- `SentryLike` — the minimal structural Sentry type this transport needs.
- `sentryTransport(Sentry)` — build a `Transport` that reports to the passed Sentry object.

## Usage

```ts
import * as Sentry from "@sentry/nextjs";
import { addTransport } from "@indiecrafts/packages-shared-logger";
import { sentryTransport } from "@indiecrafts/packages-shared-logger/sentry";

addTransport(sentryTransport(Sentry));
```

## Source

`code/packages/shared/logger/src/sentry.ts`
