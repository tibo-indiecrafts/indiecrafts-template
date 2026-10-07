---
title: "Security incident record"
description: "Stores one security incident in the audit D1, alerts on high or critical, and maps Clerk's sign-in detections to incidents."
status: stable
---

# Security incident record

> One write path for every `security_events` row the api stores.

## Purpose

Every api write of a security incident goes through `recordIncident`: the `/v1/events` `kind:"security"` route, the Clerk webhook's role→admin grant, and Clerk's own sign-in detections. It inserts the row into the audit D1, then alerts the owner on a high or critical incident through `ctx.waitUntil`, so the alert never delays or fails the caller. An IP only ever arrives hashed. The Clerk webhook passes `dedupKey: clerk:<svix-id>`: a retry of the same message stores and alerts nothing more.

Clerk detects suspicious sign-ins itself and emails only the user. `clerkEmailIncident` turns two of those emails into incidents for the owner:

| Clerk email          | Incident              | Severity | Alert |
| -------------------- | --------------------- | -------- | ----- |
| `account_locked`     | `credential_stuffing` | `high`   | yes   |
| `new_device_sign_in` | `suspicious_pattern`  | `low`    | no    |

The api sees these emails only when the template's **Delivered by Clerk** is off (the email take-over).

## Exports

- `Incident` — the row: type, severity, surface, user id, country, IP hash, description, and an optional `dedupKey`.
- `recordIncident(env, ctx, incident, ts?)` — insert, then alert on high/critical. A `dedupKey` already stored → no row, no alert. Throws only when the insert fails; a no-op when the audit D1 is unbound.
- `clerkEmailIncident(slug)` — the incident a Clerk `email.created` slug stands for, or `null`. Matches Clerk's slug variants.

## Usage

```ts
import {
  clerkEmailIncident,
  recordIncident,
} from "@indiecrafts/shared-api/security/record";

const incident = clerkEmailIncident(slug);
if (incident)
  await recordIncident(env, ctx, {
    ...incident,
    surface: "clerk",
    userId,
    country: null,
    ipHash: null,
  });
```

## Source

`code/shared/api/src/security/record.ts`
