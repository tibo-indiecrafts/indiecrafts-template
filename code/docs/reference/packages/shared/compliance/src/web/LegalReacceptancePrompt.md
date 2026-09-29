---
title: "Legal re-acceptance prompt"
description: "The popup prompting review and re-acceptance when the legal documents change."
status: stable
---

# Legal re-acceptance prompt

> Review and accept when the policy version moves.

## Purpose

The "our legal documents changed — please accept" popup (web, shadcn). Mount it at the shell root only when re-acceptance is due. `links` are the Privacy · Terms pages on the website (rendered as `<a>`); `onAccept` persists a `LegalAcceptanceRecord` via the shell's store. Copy is injected; Next-free.

## Exports

- `LegalReacceptancePrompt` — the popup component (`copy` with `[[…]]` markers in `body`, `hrefs`, `onAccept`).

## Usage

```tsx
import { LegalReacceptancePrompt } from "@indiecrafts/packages-shared-compliance/web";

<LegalReacceptancePrompt
  copy={copy}
  hrefs={legalHrefs}
  onAccept={acceptVersion}
/>;
```

## Source

`code/packages/shared/compliance/src/web/LegalReacceptancePrompt.tsx`
