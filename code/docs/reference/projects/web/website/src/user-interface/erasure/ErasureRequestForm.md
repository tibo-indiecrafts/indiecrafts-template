---
title: "Erasure request form"
description: "Anonymous branded form where a visitor submits their email and a Turnstile challenge to start erasure."
status: stable
---

# Erasure request form

> A signed-out visitor submits their email plus a Turnstile challenge to start data erasure.

## Purpose

Client component in `src/user-interface/erasure`. It posts form-encoded data straight to the public worker route `POST /v1/erasure/request` via the pure `submitErasureRequest` helper — no same-app API route in between. It embeds a `TurnstileWidget` and remounts it after a failed submit. The "sent" state always shows the same generic anti-enumeration message, whether or not the email matched a subject. All copy is resolved server-side from `messages.legal.erasure.request`.

## Exports

- `ErasureRequestForm` — React component; prop `copy`.
- `ErasureRequestCopy` — the resolved copy shape.

## Usage

```tsx
import { ErasureRequestForm } from "@/user-interface/erasure/ErasureRequestForm";

<ErasureRequestForm copy={copy} />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/erasure/ErasureRequestForm.tsx`
