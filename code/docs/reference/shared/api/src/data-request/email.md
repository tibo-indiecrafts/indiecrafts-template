---
title: "Data-request emails"
description: "The receipt and closing emails sent to a GDPR requester, in the request's language."
status: stable
---

# Data-request emails

> What the requester receives: a receipt, then the outcome.

## Purpose

Two emails to the requester, in the request's locale (`fr` → French, else English), sent through the api's Resend helper.

- **Receipt** — sent by `POST /v1/data-request` once the row is stored: the right, the reference `#id`, and the due date. Best-effort: a failure never fails the 201.
- **Closing** — sent when the operator marks a request done or rejected with "Email the requester": the outcome ("is complete" / "was declined"), the operator's note (escaped, line breaks kept), and the reference.

Copy comes from the Studio `emailStrings` groups `dataRequestReceipt` and `dataRequestClosed` (placeholders <code v-pre>{{id}}</code>, <code v-pre>{{right}}</code>, <code v-pre>{{due}}</code>, <code v-pre>{{outcome}}</code>); each blank field falls back to the built-in en/fr text. `enabled: false` turns that email off. Both return `true` only when Resend accepted the email, `false` when the mailer is unconfigured or the email is turned off, and throw on a Resend error.

## Exports

- `sendDataRequestReceipt(env, { to, id, requestType, locale, submittedAt }, fetchStrings?)`.
- `sendDataRequestClosedEmail(env, { to, id, outcome, note, locale }, fetchStrings?)`.

## Source

`code/shared/api/src/data-request/email.ts`
