---
title: "Feature-flag shape"
description: "The feature-flag type contract that every surface's features object types against."
status: stable
---

# Feature-flag shape

> The typed baseline for per-app feature flags.

## Purpose

Defines the feature-flag shape. Values stay per-app (each surface enables a different subset), but every surface's `features` object types against this, so modules can constrain the slice they need and a second app gets a typed baseline instead of an ad-hoc `as const`.

## Exports

- `FeatureValue` — a single flag, `boolean`.
- `FeatureMap` — a feature map of flat flags or nested groups.
- `defineFeatures(features)` — an identity helper that pins a surface's flags to `FeatureMap` while keeping the literal type.

## Usage

```ts
import { defineFeatures } from "@indiecrafts/packages-shared-config/web";

export const features = defineFeatures({
  blog: { comments: true },
  blockAiTraining: false,
});
```

## Source

`code/packages/shared/config/src/web/features.ts`
