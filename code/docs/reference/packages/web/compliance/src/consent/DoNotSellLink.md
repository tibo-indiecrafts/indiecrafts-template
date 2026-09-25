---
title: "Do Not Sell link"
description: "CCPA/CPRA footer link that opens the cookie preferences dialog."
status: stable
---

# Do Not Sell link

> The CCPA opt-out footer entry point, shown only in opt-out regions.

## Purpose

The CCPA/CPRA "Do Not Sell or Share My Personal Information" footer link. It opens the same preferences dialog as `ManagePreferencesButton` via `openPreferences()`. `show` is resolved server-side, so the link never flashes into view outside opt-out regions.

## Exports

- `DoNotSellLink({ label, show })` — renders the labeled link when `show` is true, otherwise nothing.

## Usage

```tsx
import { DoNotSellLink } from "@indiecrafts/packages-web-compliance/consent/DoNotSellLink";

<DoNotSellLink
  label="Do Not Sell or Share My Personal Information"
  show={mode === "opt-out"}
/>;
```

## Source

`code/packages/web/compliance/src/consent/DoNotSellLink.tsx`
