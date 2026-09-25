---
title: "Marketing nudge mount"
description: "Website mount for the one-time sign-in marketing-email consent nudge."
status: stable
---

# Marketing nudge mount

> Wires Clerk auth to the shared marketing-consent nudge.

## Purpose

The surface mount for the one-time sign-in marketing nudge. Supplies Clerk's `getToken` and gates on `isSignedIn`, keeping the shared `MarketingNudge` brick Clerk-free. Reads and writes the marketing-email consent through the api's `/v1/consent/marketing-email`.

## Exports

- `MarketingNudgeMount({ apiUrl, surface, snoozeKey, copy })` — renders the nudge inside `AppClerkProvider` when the visitor is signed in.

## Usage

```tsx
import { MarketingNudgeMount } from "@indiecrafts/packages-web-auth/marketing-nudge";

<MarketingNudgeMount
  apiUrl={apiUrl}
  surface="website"
  snoozeKey="mkt-nudge"
  copy={copy}
/>;
```

## Source

`code/packages/web/auth/src/marketing-nudge.tsx`
