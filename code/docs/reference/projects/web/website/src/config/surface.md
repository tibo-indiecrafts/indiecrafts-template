---
title: "Surface id"
description: "This surface's audit and telemetry origin identifier."
status: stable
---

# Surface id

> The one home for "which surface am I" — tags consent and session logs.

## Purpose

`surface` is this surface's audit and telemetry origin id. Consent and session logs tag their source with this value, so the audit trail stays correct as surfaces multiply. Each surface (admin, app) ships its own value.

## Exports

- `surface` — the string surface id (`"website"`).

## Usage

```ts
import { surface } from "@/config";
```

## Source

`code/projects/web/surfaces/website/src/config/surface.ts`
