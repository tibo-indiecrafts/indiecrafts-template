---
title: "Email layout shell"
description: "Renders the shared, branded, mail-client-safe HTML shell every email in the brick uses."
status: stable
---

# Email layout shell

> The table-based, inline-styled chrome that makes all outbound mail one system.

## Purpose

Renders the shared HTML email chrome. Every email in the package renders through it, so all outbound mail looks like one system. It is table-based with inline styles — the only layout technique email clients render reliably, since Gmail and Outlook strip `<style>`, flexbox, and CSS variables. The palette comes from the design tokens resolved to inline hex; edit the tokens, not this file.

## Exports

- `renderEmail(input)` — finish a template: the layout's HTML plus the plain-text `text`, both ending with the support line (in the `lang`), returned as a `RenderedEmail`. Every template returns through it.
- `renderEmailLayout(input)` — internal to the brick (not in its index): wrap `contentHtml` in the branded shell and return a full HTML document. The footer ("Sent by …", "Need help? …") follows `lang`: its own words, else the default locale's, else English.
- `escapeHtml(value)` — escape untrusted text before interpolating it into `contentHtml`.
- `EmailLayoutInput` — the layout input: `title`, optional `preheader`, `contentHtml`, optional `lang`, optional `supportEmail`.
- `RenderedEmail` — every template's return shape: `subject`, `text`, `html`.

## Usage

```ts
import { renderEmail, escapeHtml } from "@indiecrafts/packages-web-email";

return renderEmail({
  subject: "Bienvenue",
  text: `Bonjour ${name}`,
  title: "Bienvenue",
  contentHtml: `<p>Bonjour ${escapeHtml(name)}</p>`,
  lang: "fr",
  supportEmail, // from emailStrings — empty → no support line
});
```

## Source

`code/packages/web/email/src/layout.ts`
