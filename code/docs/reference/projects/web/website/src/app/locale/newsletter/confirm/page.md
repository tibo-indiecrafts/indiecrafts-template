---
title: "Newsletter confirm page"
description: "Double opt-in confirm page opened from a one-time newsletter token link."
status: stable
---

# Newsletter confirm page

> The `/newsletter/confirm` route — the double opt-in landing page for a confirmation email.

## Purpose

Server route for `/<locale>/newsletter/confirm`. The confirmation email links here with a one-time `?token=`; the page never mutates on render. The visitor taps a button that POSTs the token to `/api/newsletter/confirm`, so a link prefetcher or mail scanner cannot auto-confirm. It mounts `NewsletterConfirm` with labels from `messages.pages.newsletterConfirm`. Gated by `features.newsletter` (404 when off). Marked `robots: { index: false, follow: true }` and kept out of the `pages` map, sitemap, and llms.

## Exports

- `generateMetadata` — title/description from `pages.newsletterConfirm`, no-index.
- `NewsletterConfirmPage` (default) — the async server component.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/newsletter/confirm/page.tsx`
