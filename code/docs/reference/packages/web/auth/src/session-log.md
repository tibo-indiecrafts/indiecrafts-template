---
title: "Session event forwarder"
description: "Server-only forwarder that posts a sign-in event to the shared api."
status: stable
---

# Session event forwarder

> Forwards a session event to the api, holding the token server-side.

## Purpose

Forwards a sign-in/session event to the shared api's `/v1/events`, which writes the EU D1 `session_events`. Holds `APP_API_TOKEN` server-side and never ships it to the browser. Fire-and-forget: it no-ops when unconfigured and never throws into the caller.

## Exports

- `logSession(input)` — posts a `session` event (`surface`, `userId`, optional `sessionId`, `country`). Resolves `void`.

## Usage

```ts
import { logSession } from "@indiecrafts/packages-web-auth/session-log";

await logSession({ surface: "website", userId, sessionId, country });
```

## Source

`code/packages/web/auth/src/session-log.ts`
