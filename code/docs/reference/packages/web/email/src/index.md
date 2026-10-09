---
title: "Email brick entry"
description: "The public barrel re-exporting the email brick's send, layout, and palette API."
status: stable
---

# Email brick entry

> The shared email system's public surface — send, layout, and palette.

## Purpose

The email brick's main entry point. It re-exports the shared email SYSTEM — send, layout, the render contract, and the token-derived palette — and names no feature. Templates live with the feature that owns them (blog, newsletter, waitlist, compliance); each imports the render helpers from here.

## Exports

- `sendEmail` — send one email through the Resend REST API.
- `SendEmailInput` — the input type for `sendEmail`.
- `renderEmail` — finish a template: the shell plus the plain text, both with the support line.
- `escapeHtml` — escape untrusted text before interpolating it into the layout.
- `EmailLayoutInput` / `RenderedEmail` — the layout input and the shared template return shape.
- `EMAIL_COLORS` — the token-derived email palette (resolved hex).

## Usage

```ts
import {
  renderEmail,
  sendEmail,
  type RenderedEmail,
} from "@indiecrafts/packages-web-email";
```

## Source

`code/packages/web/email/src/index.ts`
