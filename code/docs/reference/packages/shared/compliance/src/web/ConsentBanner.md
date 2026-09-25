---
title: "Consent banner"
description: "The shared shadcn cookie-consent banner with accept, reject, and customize choices."
status: stable
---

# Consent banner

> Accept all, reject, or customize — one Next-free banner.

## Purpose

The shared cookie-consent banner (web, shadcn), Next-free so plain-React surfaces can use it. Mount it at the shell root only when consent is needed. Copy and `categories` are injected — no next-intl or Sanity inside. Three one-tap choices (Accept all, Reject, Customize); Customize expands the per-category toggles.

## Exports

- `ConsentBanner` — the banner component (`categories`, `copy`, `initialChoices`, `onAccept`, `onReject`, `onSave`).

## Usage

```tsx
import { ConsentBanner } from "@indiecrafts/packages-shared-compliance/web";

<ConsentBanner
  categories={categories}
  copy={copy}
  onAccept={acceptAll}
  onReject={rejectAll}
  onSave={saveChoices}
/>;
```

## Source

`code/packages/shared/compliance/src/web/ConsentBanner.tsx`
