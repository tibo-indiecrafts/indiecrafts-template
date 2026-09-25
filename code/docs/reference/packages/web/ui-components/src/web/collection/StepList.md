---
title: "Step list"
description: "Renders a numbered vertical step timeline."
status: stable
---

# Step list

> A numbered vertical step timeline.

## Purpose

Renders a `module.step-list` block as a numbered vertical timeline. Each step's number sits in a circle, and a connector line runs between consecutive circles so the sequence reads as a flow. Step bodies are portable text.

## Exports

- `StepList` — a numbered vertical step timeline over portable-text step bodies.

## Usage

```tsx
import { StepList } from "@indiecrafts/packages-web-ui-components/web/collection/StepList";

<StepList {...module} components={portableTextComponents} />;
```

## Source

`code/packages/web/ui-components/src/web/collection/StepList.tsx`
