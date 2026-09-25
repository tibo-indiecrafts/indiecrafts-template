---
title: "Clerk email templates"
description: "Localized HTML/text renderers for the taken-over Clerk auth emails and the welcome email."
status: stable
---

# Clerk email templates

> Per-slug renderers that produce OUR localized bodies, with a Studio override layer.

## Purpose

Defines the localized templates for the taken-over Clerk auth emails, keyed by Clerk's email template slug. Each renders our copy from the event `data` variables (the OTP code or magic-link URL), escaping untrusted text before interpolation. An optional per-field Studio override wins over the hardcoded en/fr copy; a blank field falls back. Unknown slugs are forwarded as-is by the handler.

## Exports

- `AuthCopy` — the Studio override for one email, already locale-resolved: optional `subject`, `intro`, `buttonLabel`, `outro`.
- `EmailVars` — the event's `data` variable bag.
- `Rendered` — a rendered email: `subject`, `html`, `text`.
- `AUTH_TEMPLATES` — the record of slug renderers (verification, reset, magic link, new device, and the security notices).
- `renderWelcome(locale, copy?)` — renders the post-signup welcome email, which has no Clerk slug.

## Usage

```ts
import { AUTH_TEMPLATES } from "./clerk-email/templates";

const tpl = AUTH_TEMPLATES["verification_code"];
const { subject, html, text } = tpl(vars, "fr", copy);
```

## Source

`code/shared/api/src/clerk-email/templates.ts`
