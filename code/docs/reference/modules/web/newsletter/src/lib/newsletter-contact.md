---
title: "Newsletter Resend sync"
description: "Mirrors a confirmed newsletter subscriber into Resend's news topic through the shared api."
status: stable
---

# Newsletter Resend sync

> One list to send from: a confirmed subscriber joins Resend's `news` topic.

## Purpose

The Sanity `subscriber` doc is the newsletter's source of truth. `syncNewsletterContact` posts it to the shared api (`POST /v1/newsletter/subscribers`, server token), which creates or updates the Resend contact and opts it into the `news` topic — the topic signed-in members' "news" category uses — so one Resend Broadcast reaches both. `confirmSubscriber` calls it on confirm, and `subscribe` when a confirmed lead-magnet-only address signs up for the newsletter. An unsubscribe made in Resend comes back through the api's Resend webhook. Best-effort: a failure is logged (never the address) and never fails the confirmation; without `API_URL` / `APP_API_TOKEN` it does nothing. Server-only.

## Exports

- `syncNewsletterContact({ email, locale, granted })` — mirrors the subscriber; `granted: false` opts it out of the topic.

## Source

`code/modules/web/newsletter/src/lib/newsletter-contact.ts`
