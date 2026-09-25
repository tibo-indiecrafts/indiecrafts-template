---
title: "Detection thresholds"
description: "Pure sliding-window policy that decides when failed logins become a stored credential-stuffing incident."
status: stable
---

# Detection thresholds

> The pure decision logic that turns a failed-login count into an incident.

## Purpose

The pure detection logic the api shell imports. Given a running counter for one key (a user or a hashed IP), it decides whether a stream of failed logins has crossed from noise into a stored `credential_stuffing` incident. No I/O and no Worker types, so it is pure and testable. Tuned low-volume by design, so the EU D1 only ever sees real incidents.

## Exports

- `FAILED_LOGIN` — the sliding-window policy: `escalateAt` count and `windowSeconds` TTL.
- `classifyFailedLogins(count)` — the incident to store (`credential_stuffing` at `high`, or `critical` at four times the threshold), or `null` to stay quiet.

## Usage

```ts
import { classifyFailedLogins } from "@indiecrafts/packages-shared-security-events";

const incident = classifyFailedLogins(count);
if (incident) {
  // store the credential_stuffing incident
}
```

## Source

`code/packages/shared/security-events/src/thresholds.ts`
