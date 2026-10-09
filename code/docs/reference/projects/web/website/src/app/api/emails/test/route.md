---
title: "Email test-send endpoint"
description: "Sends a sample of every enabled email to a chosen address for an editor to verify."
status: stable
---

# Email test-send endpoint

> Not public — only a signed-in editor of this Sanity project can trigger a send.

## Purpose

Powers the Studio "Send test" action. It sends a sample of every enabled email to a chosen address so an editor can verify deliverability and that the branded layout renders. It is not public: gated by `features.studio`, then the caller's Sanity session token is verified against the project's `users/me`, so only a signed-in editor of this project can trigger a send and it cannot be abused as a spam relay. The `RESEND_API_KEY` secret stays server-side, and test sends go only to the given address. The samples go out as the real emails do: each owner alert once, in the default locale; each visitor email once per site locale, labelled `<group> · <locale>` (for example `contactConfirm · fr`). Every sample carries the footer support line when `emailStrings.supportEmail` is set. The samples go out one at a time, about 0.55 s apart, to stay under Resend's default 2 requests per second; the Studio dialog names any sample that failed.

## Exports

- `POST` — sends the enabled email samples to the `to` address; returns per-email results, or `401` / `404` / `413` / `503` on failure.

## Source

`code/projects/web/surfaces/website/src/app/api/emails/test/route.ts`
