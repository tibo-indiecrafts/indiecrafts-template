---
title: "Subscriber confirm"
description: "Flips a pending newsletter subscriber to confirmed via its one-time token, then delivers any lead magnets."
status: stable
---

# Subscriber confirm

> Completes double opt-in — verify the token, mark confirmed, deliver lead magnets.

## Purpose

`confirmSubscriber` is the double opt-in completion step. It matches a `pending` subscriber by its one-time `confirmToken`, flips the status to `confirmed`, and clears the token (single-use). A bad or already-used token is a no-op. On success, any lead magnets referenced in the subscriber's `tags` are delivered best-effort, so a delivery failure never turns a real confirmation into an error. Server-only; called by the POST `/api/newsletter/confirm` route.

## Exports

- `confirmSubscriber(token)` — returns `"confirmed"` when the token matched a pending subscriber, else `"invalid"`.

## Usage

```ts
import { confirmSubscriber } from "@indiecrafts/modules-web-newsletter/lib/confirm";

const result = await confirmSubscriber(token); // "confirmed" | "invalid"
```

## Source

`code/modules/web/newsletter/src/lib/confirm.ts`
