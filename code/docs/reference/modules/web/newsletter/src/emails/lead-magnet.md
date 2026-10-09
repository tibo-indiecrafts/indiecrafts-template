---
title: "Lead-magnet email"
description: "Renders the gated-download delivery email sent after a subscriber confirms."
status: stable
---

# Lead-magnet email

> Builds the HTML and text email that carries a subscriber's signed download link.

## Purpose

Renders the lead-magnet delivery email — the message a confirmed subscriber receives with the gated download button. The file is copy-agnostic: the caller (`lib/deliver-magnet.ts`) resolves the locale strings and the signed download URL and passes them in. `intro` may be multi-line; each non-empty line becomes one escaped paragraph.

## Exports

- `LeadMagnetInput` — the render input: `subject`, `heading`, `intro`, `buttonLabel`, `downloadUrl`, `locale` (the recipient's language: the layout's `<html lang>` and footer), plus optional `outro` and `supportEmail`.
- `leadMagnetDefaults(locale, title)` — the fallback `subject`, `heading`, `intro` (with the magnet's title) and `buttonLabel` for an empty Studio field: English or French, English for any other locale.
- `renderLeadMagnetEmail(input)` — returns a `RenderedEmail` (`subject`, `text`, `html`).

## Usage

```ts
import { renderLeadMagnetEmail } from "@indiecrafts/modules-web-newsletter/emails/lead-magnet";

const email = renderLeadMagnetEmail({
  subject: "Your download is ready",
  heading: "Thanks — here's your download",
  intro: "Click below to download your guide.",
  buttonLabel: "Download the file",
  downloadUrl: "https://example.com/api/download?token=abc",
});
```

## Source

`code/modules/web/newsletter/src/emails/lead-magnet.ts`
