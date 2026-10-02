---
title: "Security event taxonomy"
description: "The app-level security-event taxonomy and the data-minimized incident shape every surface posts."
status: stable
---

# Security event taxonomy

> The incident taxonomy and the data-minimized shape every surface posts.

## Purpose

The app-level security-event taxonomy: the post-auth events Cloudflare's edge WAF cannot see. Framework-agnostic and DOM-free. It is the single home for the incident shape every surface posts to the api `/v1/events` (`kind:"security"`). Data-minimized: the caller never sends a raw IP or PII free-text, and the api derives country and a salted IP hash server-side.

## Exports

- `SecurityEventType` — the incident types, such as `failed_login`, `credential_stuffing`, `privilege_escalation`.
- `Severity` — `low`, `medium`, `high`, or `critical`.
- `SECURITY_EVENT_TYPES` · `SEVERITIES` — the same values as lists.
- `isSecurityEventType(v)` · `isSeverity(v)` — type guards. The api rejects any other value (`400`); the admin feed uses them to pick a label.
- `SecurityEvent` — the posted payload: `eventType`, `severity`, and optional `surface`, `userId`, and a short non-PII `description`.

## Usage

```ts
import type { SecurityEvent } from "@indiecrafts/packages-shared-security-events";

const event: SecurityEvent = {
  eventType: "credential_stuffing",
  severity: "high",
  surface: "website",
};
```

## Source

`code/packages/shared/security-events/src/events.ts`
