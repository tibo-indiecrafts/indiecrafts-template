---
title: "Legal re-acceptance prompt (native)"
description: "The React Native popup shown when legal documents change and re-acceptance is due."
status: stable
---

# Legal re-acceptance prompt (native)

> The "our legal documents changed" prompt for the Expo shell.

## Purpose

Renders the "our legal documents changed — please accept" popup in React Native. Mount it at the shell root only when re-acceptance is due (`needsReacceptance(store.get(), currentVersion)`). `links` open the website's Privacy · Terms pages in the system browser (`Linking.openURL`); `onAccept` persists a `LegalAcceptanceRecord`. Themed from the shared tokens.

## Exports

- `LegalReacceptancePrompt` — the prompt component. Props: `copy` (its `body` carries `[[…]]` markers), `hrefs` (the ordered privacy/terms URLs woven inline), `onAccept`.

## Usage

```tsx
import { LegalReacceptancePrompt } from "@indiecrafts/packages-shared-compliance/native";

<LegalReacceptancePrompt
  copy={copy}
  hrefs={legalHrefs}
  onAccept={recordAcceptance}
/>;
```

## Source

`code/packages/shared/compliance/src/native/LegalReacceptancePrompt.tsx`
