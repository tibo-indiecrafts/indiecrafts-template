---
title: "Marketing nudge"
description: "The one-time post-sign-in prompt for the commercial-email opt-in when no decision is on record."
status: stable
---

# Marketing nudge

> A one-time opt-in prompt for accounts with no decision yet.

## Purpose

A one-time post-sign-in prompt for the commercial-email opt-in, shown only when the user has no decision on record — a pre-existing account, or a social sign-up that bypassed the sign-up checkbox. Yes and No record a decision (the flag flips non-null, so it never shows again); the dismiss control snoozes per-device via `localStorage`. Transport-agnostic: `read` and `write` are injected.

## Exports

- `MarketingNudgeCopy` (interface) — the prompt copy (`title`, `yes`, `no`, `dismiss`).
- `MarketingNudgeProps` (interface) — the props (`read`, `write`, `snoozeKey`, `copy`).
- `MarketingNudge` — the prompt component.

## Usage

```tsx
import { MarketingNudge } from "@indiecrafts/packages-shared-compliance/web";

<MarketingNudge
  read={readOptIn}
  write={writeOptIn}
  snoozeKey={`${prefix}.marketing-nudge`}
  copy={copy}
/>;
```

## Source

`code/packages/shared/compliance/src/web/MarketingNudge.tsx`
