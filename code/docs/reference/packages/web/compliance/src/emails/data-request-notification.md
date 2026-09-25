---
title: "Data-request owner alert email"
description: "Renders the operational owner alert email for a new GDPR data-subject request."
status: stable
---

# Data-request owner alert email

> Tells the team a new rights request arrived and links to the record.

## Purpose

Renders the owner alert email sent when a visitor submits a GDPR data-subject request. It is operational (one team, French, not translated). The caller resolves the request-type label and passes it as a plain string, so this template stays free of any Sanity or compliance types. It renders through `renderEmailLayout` from the email brick.

## Exports

- `DataRequestNotificationInput` — the input shape: resolved request-type label, visitor email, optional message and source, Studio link, and editor overrides.
- `renderDataRequestNotificationEmail(input)` — returns a `RenderedEmail` with `subject`, `text`, and `html`.

## Usage

```ts
import { renderDataRequestNotificationEmail } from "@indiecrafts/packages-web-compliance/emails/data-request-notification";

const email = renderDataRequestNotificationEmail({
  requestTypeLabel: "Accès",
  email: "visitor@example.com",
  studioUrl: "https://example.com/studio",
});
```

## Source

`code/packages/web/compliance/src/emails/data-request-notification.ts`
