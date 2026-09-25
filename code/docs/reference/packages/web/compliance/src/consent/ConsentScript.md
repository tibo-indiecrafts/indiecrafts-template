---
title: "Consent script"
description: "A next/script that loads only after a consent category is granted."
status: stable
---

# Consent script

> Gates a third-party script tag on cookie consent.

## Purpose

Wraps `next/script` so a tag loads only after the visitor grants a consent `category`. For third-party tags that set cookies but do not support Google Consent Mode (Meta Pixel, Hotjar, LinkedIn Insight). Consent-Mode-aware tools load normally and gate via the signal update instead.

## Exports

- `ConsentScript({ category, ...props })` — a `next/script` gated on the named category; forwards all `Script` props.

## Usage

```tsx
import { ConsentScript } from "@indiecrafts/packages-web-compliance/consent/ConsentScript";

<ConsentScript
  category="marketing"
  src="https://connect.facebook.net/en_US/fbevents.js"
  strategy="afterInteractive"
/>;
```

## Source

`code/packages/web/compliance/src/consent/ConsentScript.tsx`
