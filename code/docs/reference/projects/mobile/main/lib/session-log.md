---
title: "Sign-in event log"
description: "Fire-and-forget reporters that log a successful or failed mobile sign-in to the shared api's events endpoint."
status: stable
---

# Sign-in event log

> Fire-and-forget sign-in reporters to the shared api's EU session log.

## Purpose

Reports mobile sign-in events to the shared api's `/v1/events` (EU D1 session log). Both reporters use the bundled public api url and the least-privilege `EXPO_PUBLIC_EVENTS_TOKEN`, an ingest abuse-gate for the `session` and `security` kinds only. They never throw; the caller dedups per session. A failed sign-in carries no PII — the api counts attempts at the edge and stores an incident only past a threshold.

## Exports

- `logSignIn(userId, sessionId?)` — logs a successful sign-in (`kind: "session"`).
- `logFailedLogin()` — reports a failed sign-in, such as a wrong OTP code (`kind: "security"`).

## Usage

```ts
import { logSignIn, logFailedLogin } from "@/lib/session-log";

void logSignIn(user.id, session.id);
void logFailedLogin();
```

## Source

`code/projects/mobile/surfaces/main/lib/session-log.ts`
