---
title: "Waitlist owner alert email"
description: "Renders the internal owner alert email fired when a new waitlist entry is created."
status: stable
---

# Waitlist owner alert email

> Builds the operational alert the team receives on each new waitlist entry.

## Purpose

Renders the new-entry owner alert. It follows the operator's locale: the caller passes the site's `defaultLocale` as `locale`. The defaults exist in English and French; any other locale gets English. Editor overrides replace the defaults. The subject may use `{{email}}` and `{{name}}` placeholders, substituted with the entry's values. A `studioUrl` button links to the waitlist in Studio.

## Exports

- `WaitlistNotificationInput` — the render input: `email`, `studioUrl`, plus optional `locale`, `name`, `source`, `subjectTemplate`, `heading`, `intro`, `outro`, and `supportEmail`.
- `renderWaitlistNotificationEmail(input)` — returns a `RenderedEmail` (`subject`, `text`, `html`).

## Usage

```ts
import { renderWaitlistNotificationEmail } from "@indiecrafts/modules-web-waitlist/emails/waitlist-notification";

const email = renderWaitlistNotificationEmail({
  email: "jo@example.com",
  name: "Jo",
  studioUrl: "https://example.com/studio",
});
```

## Source

`code/modules/web/waitlist/src/emails/waitlist-notification.ts`
