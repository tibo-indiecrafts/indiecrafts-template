---
title: "Erasure confirm form"
description: "Anonymous branded form where a visitor confirms data erasure from an emailed link."
status: stable
---

# Erasure confirm form

> A signed-out visitor who opened the emailed link types their email to confirm erasure.

## Purpose

Client component in `src/user-interface/erasure`. It posts JSON straight to the public worker route `POST /v1/erasure/confirm` via the pure `submitErasureConfirm` helper. The `token` is opaque (from the URL) and is sent only in the POST body, never rendered. All copy is resolved server-side from `messages.legal.erasure.confirm`. The form tracks status states for success, partial, mismatch, expired, and error.

## Exports

- `ErasureConfirmForm` — React component; props `copy`, `token`.
- `ErasureConfirmCopy` — the resolved copy shape.

## Usage

```tsx
import { ErasureConfirmForm } from "@/user-interface/erasure/ErasureConfirmForm";

<ErasureConfirmForm copy={copy} token={token} />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/erasure/ErasureConfirmForm.tsx`
