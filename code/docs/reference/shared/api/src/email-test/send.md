---
title: "Service email test"
description: "POST /v1/emails/test — the api worker sends a sample of its own emails for the Studio test."
status: stable
---

# Service email test

> The worker's half of the Studio "Envoyer un test": erasure, data request, Clerk and welcome emails.

## Purpose

The website's test route calls `POST /v1/emails/test` (admin bearer, rate-limited) with
`{ to, scope, locales }` for the emails this worker builds:

- `service` — `erasureToken`, `erasureComplete`, `dataRequestReceipt`, `dataRequestClosed`;
- `account` — the 12 localized Clerk templates (`AUTH_SLUGS`) and `welcome`.

Each sample goes through the real sender (`sendErasureTokenEmail`, `sendDataRequestReceipt`,
`sendAuthTemplate`, `sendWelcomeEmail`, …) with the real Studio copy, footer and language, once per
locale, one at a time (550 ms apart). Only the data is a sample: request `#0`, code `000000`, links with
no valid token. `withoutCopies` drops the QA `bccAll` and every group's `copySupport`, so a test never
copies anyone. A group switched off in the Studio is left out; a failed send is reported and the rest
still go. Answers `{ results: [{ label: "<email> · <locale>", ok }] }`; `400` for a bad address, scope
or locale; `503` without `RESEND_API_KEY` or `EMAIL_FROM`.

## Exports

- `sendTestEmails(env, { to, scope, locales }, sleep?)` — sends and reports each sample.
- `withoutCopies(strings)` — the Studio copy with every copy setting off.
- `TEST_SCOPES` · `isTestScope(value)` · `TestScope` · `TestResult`.

## Source

`code/shared/api/src/email-test/send.ts`
