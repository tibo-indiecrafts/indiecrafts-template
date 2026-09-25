---
title: "Email test-send endpoint"
description: "Sends a sample of every enabled email to a chosen address for an editor to verify."
status: stable
---

# Email test-send endpoint

> Not public — only a signed-in editor of this Sanity project can trigger a send.

## Purpose

Powers the Studio "Send test" action. It sends a sample of every enabled email to a chosen address so an editor can verify deliverability and that the branded layout renders. It is not public: gated by `features.studio`, then the caller's Sanity session token is verified against the project's `users/me`, so only a signed-in editor of this project can trigger a send and it cannot be abused as a spam relay. The `RESEND_API_KEY` secret stays server-side, and test sends go only to the given address.

## Exports

- `POST` — sends the enabled email samples to the `to` address; returns per-email results, or `401` / `404` / `413` / `503` on failure.

## Source

`code/projects/web/surfaces/website/src/app/api/emails/test/route.ts`
