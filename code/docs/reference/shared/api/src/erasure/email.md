---
title: "Erasure emails"
description: "Worker-side Resend sender for the two erasure transactional emails, with Studio-editable copy and an English fallback."
status: stable
---

# Erasure emails

> Sends the erasure token and completion emails from the bare Worker via Resend.

## Purpose

Sends the erasure flow's two transactional emails. The shared `@indiecrafts/packages-web-email` layer is `server-only` and Next-coupled, so this inlines a small Resend POST and a local `escapeHtml`. Copy is read from the Studio-editable `emailStrings` singleton over raw GROQ-over-HTTP, with a per-field fallback to hard-coded English — these emails are mandatory, so a missing or unreachable Sanity, or an operator setting `enabled: false`, never stops the send.

## Exports

- `MailEnv` — the env slice this module needs (Resend key, From address, BCC controls, Sanity read config).
- `supportFooter(supportEmail, locale)` — the editor-owned support-address footer in the recipient's language ("Need help?" / "Besoin d'aide ?"), returned as `{ html, text }`.
- `inLanguage(html, locale)` — wraps an HTML fragment in `<div lang="…">` (the locale escaped). The worker sends fragments, not documents, so this is how a mail client's screen reader knows the language. Used by the welcome email and the Clerk take-over.
- `readProfileLocale(db, { userId, fingerprint })` — the recipient's stored `user_profiles.locale`, defaulting on any miss; never throws.
- `escapeHtml(value)` — HTML-escapes untrusted text before it enters an email body.
- `fetchEmailStrings(env, projection)` — one `emailStrings` projection over GROQ-HTTP; `null` on any failure (never throws). The data-request emails share it.
- `resend(env, { to, subject, html, text, bcc?, supportCopy? })` — the low-level Resend send; silent no-op when unconfigured. `bcc` (the Studio `bccAll`) needs the `EMAIL_BCC_ALL_ENABLED` gate; `supportCopy` does not — it is always the site's own support address.
- `supportCopyOf(group, supportEmail)` — the support address when the group's `copySupport` is on, else `undefined`. Only `erasureComplete` offers it here: the token email carries the confirm link, so it never copies.
- `sendErasureTokenEmail(env, { to, confirmUrl, locale? }, fetchStrings?)` — the request's token-confirmation email.
- `sendErasureCompleteEmail(env, { to, retained, locale? }, fetchStrings?)` — the completion email sent after the erasure run.

## Usage

```ts
import { sendErasureTokenEmail } from "@indiecrafts/api/erasure/email";

await sendErasureTokenEmail(env, {
  to: email,
  confirmUrl,
  locale: subject.locale,
});
```

## Source

`code/shared/api/src/erasure/email.ts`
