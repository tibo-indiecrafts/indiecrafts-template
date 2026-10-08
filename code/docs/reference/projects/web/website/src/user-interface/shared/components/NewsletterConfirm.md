---
title: "Newsletter confirm"
description: "Client component that confirms a double opt-in newsletter subscription by POSTing the one-time token."
status: stable
---

# Newsletter confirm

> The interactive half of the newsletter confirm page.

## Purpose

Confirms a double opt-in newsletter subscription. The confirmation email links to the page with the signed token in the URL fragment (`#t=…`): browsers never send a fragment to a server, so the address it carries stays out of request logs. The component reads the token once (`useSyncExternalStore` — `null` on the server), drops it from the address bar, and POSTs it to `/api/newsletter/confirm` only when the visitor taps the button, so a mail scanner or link prefetcher cannot confirm. No token → the `invalid` state. A failed save (`502`) → the `error` state, with the button kept to try again.

## Exports

- `NewsletterConfirm` — the confirm component; takes a `labels` object, renders the idle / confirmed / invalid / error states.
- `NewsletterConfirmLabels` — the type for the localized copy passed via `labels`.

## Usage

```tsx
import { NewsletterConfirm } from "@/user-interface/shared/components/NewsletterConfirm";

<NewsletterConfirm labels={labels} />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/shared/components/NewsletterConfirm.tsx`
