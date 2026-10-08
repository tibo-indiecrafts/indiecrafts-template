---
title: "Newsletter owner alert email"
description: "Renders the internal owner alert email fired when a new subscriber joins."
status: stable
---

# Newsletter owner alert email

> Builds the operational alert the team receives on each new newsletter subscriber.

## Purpose

Renders the new-subscriber owner alert. It follows the operator's locale: the caller passes the site's `defaultLocale` as `locale`. The defaults exist in English and French; any other locale gets English. Editor overrides replace the defaults. The subject may use a `{{email}}` placeholder, which is substituted with the subscriber's address. A `studioUrl` button links to the subscriber list in Studio.

## Exports

- `NewsletterNotificationInput` — the render input: `subscriberEmail`, `studioUrl`, plus optional `locale`, `source`, `subjectTemplate`, `heading`, `intro`, `outro`, and `supportEmail`.
- `renderNewsletterNotificationEmail(input)` — returns a `RenderedEmail` (`subject`, `text`, `html`).

## Usage

```ts
import { renderNewsletterNotificationEmail } from "@indiecrafts/modules-web-newsletter/emails/newsletter-notification";

const email = renderNewsletterNotificationEmail({
  subscriberEmail: "jo@example.com",
  source: "/blog/my-post",
  studioUrl: "https://example.com/studio",
});
```

## Source

`code/modules/web/newsletter/src/emails/newsletter-notification.ts`
