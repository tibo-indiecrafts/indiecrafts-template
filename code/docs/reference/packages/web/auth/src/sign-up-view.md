---
title: "Sign-up view"
description: "Clerk's prebuilt sign-up card with locale and marketing opt-in metadata."
status: stable
---

# Sign-up view

> The token-themed sign-up surface with a GDPR marketing opt-in.

## Purpose

Renders Clerk's prebuilt `<SignUp>`, themed from the design tokens and carrying the active locale plus a marketing-email opt-in in `unsafeMetadata`. The api's Clerk webhook mirrors both to `user_profiles`. An unchecked opt-in checkbox renders beside the card, because Clerk's card can't host a custom field.

## Exports

- `SignUpView({ home?, locale?, marketingLabel? })` — the sign-up surface. Omitting `marketingLabel` hides the checkbox, so the metadata carries no marketing decision.

## Usage

```tsx
import { SignUpView } from "@indiecrafts/packages-web-auth";

export default function Page() {
  return (
    <SignUpView home="/" locale="fr" marketingLabel="Send me product news" />
  );
}
```

## Source

`code/packages/web/auth/src/sign-up-view.tsx`
