---
title: "Marketing consent nudge (native)"
description: "The one-time post-sign-in marketing-email prompt for React Native."
status: stable
---

# Marketing consent nudge (native)

> The native one-time post-sign-in marketing prompt.

## Purpose

Renders a one-time post-sign-in prompt in React Native, shown only when the user has no marketing decision on record (`GET` returns null). Yes and No record a decision (never shown again); dismiss snoozes per device via AsyncStorage. It does its own authenticated API fetches, so it is self-contained. The screen mounts it only for a signed-in user.

## Exports

- `MarketingNudge` — the nudge component.
- `MarketingNudgeProps` — its props type: `apiUrl`, `getToken`, `surface`, `snoozeKey`, `copy`.
- `MarketingNudgeCopy` — the copy shape: `title`, `yes`, `no`, `dismiss`.

## Usage

```tsx
import { MarketingNudge } from "@indiecrafts/packages-shared-compliance/native";

<MarketingNudge
  apiUrl={apiUrl}
  getToken={getToken}
  surface="mobile"
  snoozeKey="marketing-nudge"
  copy={copy}
/>;
```

## Source

`code/packages/shared/compliance/src/native/MarketingNudge.tsx`
