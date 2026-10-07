---
title: "Comment moderation endpoint"
description: "One-click comment moderation from the notification email, with a confirm step."
status: stable
---

# Comment moderation endpoint

> GET renders a confirm page; the mutation happens only on the confirm POST.

## Purpose

Lets a site owner moderate a comment straight from the notification email. `GET` renders a read-only confirm page, so a link scanner or prefetcher cannot auto-moderate; the state change runs only on the confirm `POST`. The one-time `moderationToken` is the authorization. Both handlers `404` when comments are disabled, and the `POST` adds a defence-in-depth rate limit against token brute-force. The page copy is the bundled `messages.moderation` in the default locale (the email's language), read without a Sanity call.

## Exports

- `GET` — renders the self-contained HTML confirm page for a `token` and `action`.
- `POST` — applies the moderation action (`approve`, `spam`, or `delete`) and renders the result.

## Source

`code/projects/web/surfaces/website/src/app/api/comments/moderate/route.ts`
