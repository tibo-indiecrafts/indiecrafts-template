---
title: "Legal re-acceptance prompt"
description: "The banner every web surface shows when the legal documents change."
status: stable
---

# Legal re-acceptance prompt

> One banner on every web surface: review and accept when the policy version moves.

## Purpose

The "we updated our policies — please accept" banner. It is fixed to the bottom, centered, and non-blocking: one sentence with the policy links, and an Accept button. Mount it only when re-acceptance is due; `onAccept` persists acceptance through the caller's store. The `app` surface renders it from `LegalGate`; the website renders it through `LegalNotice` (`packages-web-compliance`). Copy is injected; Next-free.

## Exports

- `LegalReacceptancePrompt({ message, hrefs, acceptLabel, onAccept, raised?, link? })` — `message` carries `[[…]]` link markers; `hrefs` are the matching policy URLs (privacy · terms). `link` renders each link — the default opens the website's policy page in a new tab; the website passes its locale `Link`. `raised` moves it above a cookie banner that is still open.

## Usage

```tsx
import { LegalReacceptancePrompt } from "@indiecrafts/packages-shared-compliance/web";

<LegalReacceptancePrompt
  message={t("body")}
  hrefs={legalHrefs}
  acceptLabel={t("accept")}
  onAccept={acceptVersion}
/>;
```

## Source

`code/packages/shared/compliance/src/web/LegalReacceptancePrompt.tsx`
