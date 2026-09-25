---
title: "Legal re-acceptance prompt (native)"
description: "The React Native popup shown when legal documents change and re-acceptance is due."
status: stable
---

# Legal re-acceptance prompt (native)

> The "our legal documents changed" prompt for the Expo shell.

## Purpose

Renders the "our legal documents changed — please review and accept" popup in React Native. Mount it at the shell root only when re-acceptance is due (`needsReacceptance(store.get(), currentVersion)`). `onReview` opens the legal screen; `onAccept` persists a `LegalAcceptanceRecord`. Themed from the shared tokens.

## Exports

- `LegalReacceptancePrompt` — the prompt component. Props: `copy`, `onReview`, `onAccept`.

## Usage

```tsx
import { LegalReacceptancePrompt } from "@indiecrafts/packages-shared-compliance/native";

<LegalReacceptancePrompt
  copy={copy}
  onReview={openLegalScreen}
  onAccept={recordAcceptance}
/>;
```

## Source

`code/packages/shared/compliance/src/native/LegalReacceptancePrompt.tsx`
