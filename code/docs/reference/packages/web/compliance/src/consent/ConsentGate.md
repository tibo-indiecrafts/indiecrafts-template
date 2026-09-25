---
title: "Consent gate"
description: "Renders children only while a consent category is granted."
status: stable
---

# Consent gate

> Mount children on consent, unmount on withdrawal.

## Purpose

Renders its children only while the visitor has granted a consent `category`. It re-renders on consent change, so children mount on accept and unmount on withdrawal. The slot for a cookie-setting pixel, embed, or widget that is not Consent-Mode-aware.

## Exports

- `ConsentGate({ category, children })` — gates `children` on the named consent category key.

## Usage

```tsx
import { ConsentGate } from "@indiecrafts/packages-web-compliance/consent/ConsentGate";

<ConsentGate category="marketing">
  <MetaPixel />
</ConsentGate>;
```

## Source

`code/packages/web/compliance/src/consent/ConsentGate.tsx`
