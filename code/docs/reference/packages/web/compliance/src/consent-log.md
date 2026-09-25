---
title: "Consent event forwarder"
description: "Server-only forwarder that posts a consent decision to the shared api."
status: stable
---

# Consent event forwarder

> Forwards a consent decision to the api, holding the token server-side.

## Purpose

Forwards one consent decision to the api's `POST /v1/events` (`kind: consent`). Server-only: it holds `APP_API_TOKEN` and never runs in the browser. Fire-and-forget — a failed forward never breaks the caller. The api resolves the email fingerprint from `user_profiles`; the email itself is never sent.

## Exports

- `logConsent(input)` — posts a consent event (`userId`, `consentId`, `events`, `version`, `surface`, `decisionId`, optional `source`, `country`). Resolves `void`.

## Usage

```ts
import { logConsent } from "@indiecrafts/packages-web-compliance/consent-log";

await logConsent({
  userId,
  consentId,
  events: [{ type: "marketing", granted: true }],
  version: "2024-01",
  surface: "website",
  decisionId,
});
```

## Source

`code/packages/web/compliance/src/consent-log.ts`
