---
title: "Pricing"
description: "Renders a row of pricing plan cards with features and CTAs."
status: stable
---

# Pricing

> A row of pricing plan cards.

## Purpose

Renders a `module.pricing` block: a title and intro over a row of plan cards. A highlighted tier gets the brand ring and a badge. Each tier lists its features with a check and a full-width CTA. The cards sit in three columns from a `@3xl` container, so the block fits a narrow column.

## Exports

- `Pricing` — a title and intro over a row of plan cards.

## Usage

```tsx
import { Pricing } from "@indiecrafts/packages-web-ui-components/web/collection/Pricing";

<Pricing {...module} />;
```

## Source

`code/packages/web/ui-components/src/web/collection/Pricing.tsx`
