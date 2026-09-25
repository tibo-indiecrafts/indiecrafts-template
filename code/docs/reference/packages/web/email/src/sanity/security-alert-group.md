---
title: "Security alert email group"
description: "Sanity fields for the internal security-alert email's editable copy."
status: stable
---

# Security alert email group

> The two editable prose fields of the internal security-alert email.

## Purpose

Defines the Sanity object group for the operator-facing security-alert email that the `code/shared/api` worker sends on a high or critical incident. Only the subject prefix and the intro line are editable; the incident details are inserted automatically. The group is English-only and has no on/off toggle, so the alert can never be silenced from Studio.

## Exports

- `securityAlertGroups` — a `FieldDefinition[]` holding the `securityAlert` object (`subjectPrefix` + `intro`), wired into the `emailStrings` singleton.

## Usage

```ts
import { securityAlertGroups } from "@indiecrafts/packages-web-email/sanity";

emailSanity([...allModules, { emailGroups: securityAlertGroups }]);
```

## Source

`code/packages/web/email/src/sanity/security-alert-group.ts`
