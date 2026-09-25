---
title: "Marketing nudge gate"
description: "Mounts the one-time marketing sign-in nudge for a signed-in mobile user, deferring to the consent banner."
status: stable
---

# Marketing nudge gate

> The signed-in marketing-email prompt, held back until any consent decision resolves.

## Purpose

Renders the shared `MarketingNudge` overlay for a signed-in user who has no marketing-email decision yet. It is kept out of `ShellOverlays` because it calls Clerk's `useAuth`, which throws without a provider, so `ShellOverlays` mounts it only when `hasClerk`. While a cookie-consent decision is still pending it renders nothing, so the two bottom-anchored overlays never stack.

## Exports

- `MarketingNudgeGate` — React component; takes no props, returns the nudge overlay or `null`.

## Usage

```tsx
import { MarketingNudgeGate } from "@/components/MarketingNudgeGate";

// Mounted only when Clerk is wired (the auth provider exists).
{
  hasClerk ? <MarketingNudgeGate /> : null;
}
```

## Source

`code/projects/mobile/surfaces/main/components/MarketingNudgeGate.tsx`
