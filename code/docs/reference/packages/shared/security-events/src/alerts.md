---
title: "Security alerts"
description: "Decides which incident severities page the operator and builds the internal alert email copy."
status: stable
---

# Security alerts

> Which severities alert, and the internal alert email copy.

## Purpose

The alerting layer for app-level security incidents. It defines which severities page the operator and builds the internal alert email copy. The copy is pure, null-safe, and non-PII: it carries the pseudonymous Clerk user id, never a raw IP or email. A Studio-editable overlay can override the subject prefix and intro line.

## Exports

- `ALERT_SEVERITIES` — the severities that alert: `high` and `critical`.
- `shouldAlert(severity)` — whether a severity should page the operator.
- `formatSecurityAlert(alert, copy?)` — build the `{ subject, text }` alert email; `copy` overrides the subject prefix and intro.
- `SecurityAlert` — the incident data the email renders.
- `SecurityAlertCopy` — the Studio-editable `subjectPrefix` and `intro` overlay.

## Usage

```ts
import {
  shouldAlert,
  formatSecurityAlert,
} from "@indiecrafts/packages-shared-security-events";

if (shouldAlert(incident.severity)) {
  const { subject, text } = formatSecurityAlert(incident);
}
```

## Source

`code/packages/shared/security-events/src/alerts.ts`
