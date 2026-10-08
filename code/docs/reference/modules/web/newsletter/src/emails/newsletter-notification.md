---
title: "Newsletter owner alert email"
description: "Renders the internal owner alert email fired when a subscriber confirms."
status: stable
---

# Newsletter owner alert email

> Builds the operational alert the team receives on each confirmed newsletter subscriber.

## Purpose

Renders the new-subscriber owner alert. It follows the operator's locale: the caller passes the site's `defaultLocale` as `locale`. The defaults exist in English and French; any other locale gets English. Editor overrides replace the defaults. The subject may use a `{{email}}` placeholder, which is substituted with the subscriber's address. It lists the address, the subscriber's language (`subscriberLocale`) and the source page. Subscribers live in Resend, so there is no Studio link.

## Exports

- `NewsletterNotificationInput` — the render input: `subscriberEmail`, plus optional `locale`, `subscriberLocale`, `source`, `subjectTemplate`, `heading`, `intro`, `outro`, and `supportEmail`.
- `renderNewsletterNotificationEmail(input)` — returns a `RenderedEmail` (`subject`, `text`, `html`).

## Usage

```ts
import { renderNewsletterNotificationEmail } from "@indiecrafts/modules-web-newsletter/emails/newsletter-notification";

const email = renderNewsletterNotificationEmail({
  subscriberEmail: "jo@example.com",
  source: "/blog/my-post",
  subscriberLocale: "fr",
});
```

## Source

`code/modules/web/newsletter/src/emails/newsletter-notification.ts`
