---
title: "Consent banner (native)"
description: "The React Native cookie-consent banner with expandable per-category toggles."
status: stable
---

# Consent banner (native)

> The shared cookie-consent banner for the Expo shell.

## Purpose

Renders the cookie-consent banner in React Native. Mount it at the shell root only when consent is needed. Copy and `categories` are injected. It offers three choices — Accept all, Reject, and Customize — where Customize expands the per-category toggles. It is themed from the shared tokens.

## Exports

- `ConsentBanner` — the banner component. Props: `categories`, `copy`, optional `initialChoices`, and the `onAccept`, `onReject`, `onSave` handlers.

## Usage

```tsx
import { ConsentBanner } from "@indiecrafts/packages-shared-compliance/native";

<ConsentBanner
  categories={categories}
  copy={copy}
  onAccept={acceptAll}
  onReject={rejectAll}
  onSave={saveChoices}
/>;
```

## Source

`code/packages/shared/compliance/src/native/ConsentBanner.tsx`
