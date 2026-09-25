---
title: "Session logger"
description: "Client component that fires one session-log ping per Clerk session."
status: stable
---

# Session logger

> One deduped session ping per Clerk session.

## Purpose

Fires one session-log ping per Clerk session, deduped in `sessionStorage`, to the app's same-origin `/api/session-log` route. That route forwards it server-side, so `APP_API_TOKEN` never reaches the browser. Renders nothing.

## Exports

- `SessionLogger({ surface })` — mount once app-wide under `<ClerkProvider>`.

## Usage

```tsx
import { SessionLogger } from "@indiecrafts/packages-web-auth";

<SessionLogger surface="website" />;
```

## Source

`code/packages/web/auth/src/session-logger.tsx`
