---
title: "Subscriber purpose"
description: "Tells a newsletter sign-up from a lead-magnet-only one."
status: stable
---

# Subscriber purpose

> Newsletter consent and lead-magnet consent are different consents.

## Purpose

The newsletter block and the lead-magnet block post to the same engine. A lead-magnet sign-up agrees to receive a document, not the newsletter, so it must never be exported or synced as a newsletter subscriber. The `subscriber` doc's `newsletter` field records the purpose; `wantsNewsletter` reads it, and treats a doc saved before the field existed as a newsletter sign-up unless it came from a lead magnet.

## Exports

- `LEAD_MAGNET_SOURCE` — `"lead-magnet"`, the `source` the lead-magnet block posts.
- `wantsNewsletter({ newsletter, source })` — the stored newsletter consent.

## Source

`code/modules/web/newsletter/src/lib/purpose.ts`
