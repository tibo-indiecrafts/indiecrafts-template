---
title: "Alert"
description: "shadcn/ui inline callout for a short, important message."
status: stable
---

# Alert

> An inline, non-modal callout with `default` and `destructive` variants.

## Purpose

A CLI-managed shadcn/ui primitive. It renders a bordered callout with an optional leading icon, a title, and a description. Do not hand-edit; `shadcn add` regenerates it.

## Exports

- `Alert` — the container; accepts `variant` of `default` or `destructive`; sets `role="alert"`.
- `AlertTitle` — the heading line.
- `AlertDescription` — the body text.

## Usage

```tsx
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@indiecrafts/packages-web-ui/web/alert";

<Alert variant="destructive">
  <AlertTitle>Payment failed</AlertTitle>
  <AlertDescription>Check your card details and try again.</AlertDescription>
</Alert>;
```

## Source

`code/packages/web/ui/src/web/alert.tsx`
