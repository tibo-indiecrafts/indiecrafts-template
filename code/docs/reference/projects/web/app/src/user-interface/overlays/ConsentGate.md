---
title: "Consent gate"
description: "The cookie-consent banner plus its geo auto-seed, gated by the requireConsent feature."
status: stable
---

# Consent gate

> The cookie-consent banner and its geo-based auto-seed.

## Purpose

Renders the cookie-consent banner for the app surface. In opt-in regions it shows the blocking banner, first in the overlay queue (`useOverlayTurn("consent", …)`), so the other overlays wait until the visitor decides. In opt-out or none regions it seeds a default consent record once (accept-all unless a browser or server GPC signal denies), so the record exists for the legal gate and analytics default. Explicit accept, reject, and save calls persist the choice and show a saved toast whose "Manage" opens the account's Privacy tab (`/account#/privacy`); the geo seed stays silent. Every decision, the seed included, goes to `reportConsent` → `/api/consent-log`, which logs it for a signed-in user. The whole gate is off unless `features.requireConsent` is enabled.

## Exports

- `ConsentGate` — the banner component. Props: `mode` (`ConsentMode`, the geo-resolved consent mode) and `gpcSignal` (boolean, the server-detected `Sec-GPC: 1` header).

## Usage

```tsx
import { ConsentGate } from "@/user-interface/overlays/ConsentGate";

<ConsentGate mode="opt-in" gpcSignal={false} />;
```

## Source

`code/projects/web/surfaces/app/src/user-interface/overlays/ConsentGate.tsx`
