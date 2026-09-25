---
title: "Newsletter confirm"
description: "Client component that confirms a double opt-in newsletter subscription by POSTing the one-time token."
status: stable
---

# Newsletter confirm

> The interactive half of the newsletter confirm page.

## Purpose

Confirms a double opt-in newsletter subscription. The confirmation email links to a page (a bare GET never mutates); clicking the button here POSTs the one-time token to `/api/newsletter/confirm`, so a mail scanner or link prefetcher cannot confirm a subscription without a human tap. A missing token starts in the `invalid` state.

## Exports

- `NewsletterConfirm` — the confirm component; takes a `token` and a `labels` object, renders the idle / confirmed / invalid states.
- `NewsletterConfirmLabels` — the type for the localized copy passed via `labels`.

## Usage

```tsx
import { NewsletterConfirm } from "@/user-interface/shared/components/NewsletterConfirm";

<NewsletterConfirm token={token} labels={labels} />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/shared/components/NewsletterConfirm.tsx`
