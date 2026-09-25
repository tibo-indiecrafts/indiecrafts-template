---
title: "Security alert email"
description: "Sends the internal high/critical security-incident email through Resend, best-effort."
status: stable
---

# Security alert email

> Alert the owner/DPO of a high or critical incident — never silenced, never throws.

## Purpose

Sends the internal security-alert email for a high or critical incident. It reuses the inlined Resend POST from the erasure module, because the server-only email package is unusable in this bare Worker. The subject prefix and intro line are Studio-editable (the `securityAlert` `emailStrings` group), read over raw GROQ-HTTP with a fallback to hard-coded English. There is no on/off toggle: a security alert can never be silenced from Studio, and a missing or unreachable Sanity only falls back, never skips the send.

## Exports

- `sendSecurityAlertEmail` — alert the owner/DPO of an incident. No-ops when Resend is unset or no recipient resolves. Never throws; the caller fires it via `ctx.waitUntil`.

## Usage

```ts
import { sendSecurityAlertEmail } from "@indiecrafts/shared-api/security/alert";

ctx.waitUntil(sendSecurityAlertEmail(env, alert));
```

## Source

`code/shared/api/src/security/alert.ts`
