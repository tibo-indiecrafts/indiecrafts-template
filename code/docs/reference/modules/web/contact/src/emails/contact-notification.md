---
title: "Contact notification email"
description: "Renders the owner-facing alert email that carries a new contact message."
status: stable
---

# Contact notification email

> The owner alert on a new contact message, in the site's default locale.

## Purpose

This template renders the owner alert sent on every new contact message. It carries the message body plus the sender's details and a link into Studio. The caller sets `reply-to` to the sender, so Reply answers the person. It follows the operator's locale: the caller passes the site's `defaultLocale` as `locale`. The defaults exist in English and French; any other locale gets English. Editor overrides for `heading`, `intro`, `outro`, and a `subjectTemplate` are optional and fall back to these defaults. The subject template supports `{{email}}`, `{{name}}`, and `{{subject}}` placeholders.

## Exports

- `renderContactNotificationEmail` — takes `ContactNotificationInput`, returns a `RenderedEmail` (`{ subject, text, html }`).
- `ContactNotificationInput` — type with `email`, `message`, `studioUrl`, and optional `locale`, `name`, `subject`, `source`, `subjectTemplate`, `heading`, `intro`, `outro`, `supportEmail`.

## Usage

```ts
import { renderContactNotificationEmail } from "@indiecrafts/modules-web-contact/emails/contact-notification";

const email = renderContactNotificationEmail({
  email: "visitor@example.com",
  message: "Bonjour, j'ai une question.",
  studioUrl: "https://example.com/studio",
  locale: "fr",
});
```

## Source

`code/modules/web/contact/src/emails/contact-notification.ts`
