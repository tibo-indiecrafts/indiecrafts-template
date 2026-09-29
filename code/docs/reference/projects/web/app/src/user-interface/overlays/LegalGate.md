---
title: "Legal gate"
description: "The legal re-acceptance prompt, shown when the accepted policy version is stale."
status: stable
---

# Legal gate

> The legal re-acceptance prompt for a stale policy version.

## Purpose

Renders the legal re-acceptance prompt when the user's accepted policy version is out of date. It reads both the legal and consent stores: while the consent banner is still pending it suppresses itself, so only one bottom popup shows at a time. It waits for the effective version (`useEffectiveLegalVersion`: the website's live version, else the static `policyVersion`), so an early Accept never records a stale version. The policy links open the website's pages; Accept records that version and shows a saved toast.

## Exports

- `LegalGate` — the prompt component. Prop: `locale` (`Locale`) used to build the outbound legal URL.

## Usage

```tsx
import { LegalGate } from "@/user-interface/overlays/LegalGate";

<LegalGate locale="en" />;
```

## Source

`code/projects/web/surfaces/app/src/user-interface/overlays/LegalGate.tsx`
