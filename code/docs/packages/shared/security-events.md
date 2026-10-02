---
title: "@indiecrafts/packages-shared-security-events"
description: The DOM-free security-event taxonomy plus the pure detection logic the api imports.
status: stable
order: 1
---

# `@indiecrafts/packages-shared-security-events` — security taxonomy + detection (DOM-free)

## Purpose

> The contract every surface uses to report a post-auth security incident.

`@indiecrafts/packages-shared-security-events` is the framework-agnostic security taxonomy and
detection core. It defines the incident shape surfaces post to the api `/v1/events`, plus the pure
threshold, counter, and alert logic the `api` shell runs (services are shells — job logic lives in
a brick). It has no dependencies and no Worker types. It covers only the low-volume post-auth
incidents Cloudflare's edge WAF cannot see; the edge firehose stays in Cloudflare's own dashboard.

## Exports

Root `.` barrel:

- **`SecurityEventType` · `Severity` · `SecurityEvent`** (`./events`) — the taxonomy and the
  `kind:"security"` payload. Data-minimized: no raw IP, no PII free-text; the api derives country
  and a salted IP hash server-side. `SECURITY_EVENT_TYPES` · `SEVERITIES` list the same values;
  `isSecurityEventType` · `isSeverity` guard them — the api rejects anything else with a `400`.
- **`classifyFailedLogins(count)` · `FAILED_LOGIN`** (`./thresholds`) — pure sliding-window policy.
  It reports each crossing once: a running failed-login count that reaches the threshold is a
  `high` `credential_stuffing` incident, 4× it is `critical`, every other count is quiet. No I/O.
- **`bumpCounter(kv, key, ttlSeconds)` · `KvLike`** (`./kv-counter`) — a TTL counter over a
  structural KV surface. Read-then-write, not atomic — fine for low-volume counting.
- **`ALERT_SEVERITIES` · `shouldAlert(severity)` · `formatSecurityAlert(alert, copy?)` ·
  `SecurityAlert` · `SecurityAlertCopy`** (`./alerts`) — which incidents page the operator, and the
  pure, non-PII internal alert email copy.

## Usage example

Count a failed login in KV, then classify the running count.

```ts
import {
  bumpCounter,
  classifyFailedLogins,
  FAILED_LOGIN,
} from "@indiecrafts/packages-shared-security-events";

const count = await bumpCounter(
  env.KV,
  `failed:${ipHash}`,
  FAILED_LOGIN.windowSeconds,
);
const incident = classifyFailedLogins(count); // null → keep counting; else { eventType, severity }
```

## Consumers

The **`api`** service (`code/shared/api`) — imports the detection logic and the alert formatter
(`src/index.ts`, `src/security/alert.ts`). Every surface posts to the api using the `SecurityEvent`
shape.

Source → [`code/packages/shared/security-events/`](/packages/shared/security-events). Full
design → [security hardening](/projects/web/website/config/security-hardening).
