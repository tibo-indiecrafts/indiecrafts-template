---
title: "Legal gate"
description: "The legal re-acceptance prompt, shown when the accepted policy version is stale."
status: stable
---

# Legal gate

> The legal re-acceptance prompt for a stale policy version.

## Purpose

Renders the legal re-acceptance prompt when the user's accepted policy version is out of date. It waits its turn in the overlay queue (`useOverlayTurn("legal", …)`): behind the consent banner, one overlay at a time. It waits for the effective version (`useEffectiveLegalVersion`: the website's live version, else the static `policyVersion`), so an early Accept never records a stale version. `SignedInLegalGate` keys the gate on the Clerk user id, so signing in (a client-side navigation) remounts it and re-reads the server acceptance. The policy links open the website's pages; Accept records that version and shows a saved toast.

## Exports

- `LegalGate` — the prompt component. Prop: `locale` (`Locale`) used to build the outbound legal URL.

## Usage

```tsx
import { LegalGate } from "@/user-interface/overlays/LegalGate";

<LegalGate locale="en" />;
```

## Source

`code/projects/web/surfaces/app/src/user-interface/overlays/LegalGate.tsx`
