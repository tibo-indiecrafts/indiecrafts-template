---
title: "Legal re-acceptance prompt"
description: "The popup prompting review and re-acceptance when the legal documents change."
status: stable
---

# Legal re-acceptance prompt

> Review and accept when the policy version moves.

## Purpose

The "our legal documents changed — please review and accept" popup (web, shadcn). Mount it at the shell root only when re-acceptance is due. `onReview` opens the legal pages on the website; `onAccept` persists a `LegalAcceptanceRecord` via the shell's store. Copy is injected; Next-free.

## Exports

- `LegalReacceptancePrompt` — the popup component (`copy`, `onReview`, `onAccept`).

## Usage

```tsx
import { LegalReacceptancePrompt } from "@indiecrafts/packages-shared-compliance/web";

<LegalReacceptancePrompt
  copy={copy}
  onReview={openLegalPages}
  onAccept={acceptVersion}
/>;
```

## Source

`code/packages/shared/compliance/src/web/LegalReacceptancePrompt.tsx`
