---
title: "Not-found screen (native)"
description: "Presentational React Native 404 screen; the app owns navigation via onGoHome."
status: stable
---

# Not-found screen (native)

> The native 404 screen — same copy contract as web, navigation owned by the app.

## Purpose

Renders the centered 404 screen for React Native surfaces. It extends the shared `NotFoundContentProps` with an `onGoHome` callback so the app owns navigation (for example `router.replace("/")`). It reads the shared token colours and owns its own background.

## Exports

- `NotFoundContent` — the React Native 404 screen component.
- `NotFoundContentProps` — the base copy contract plus an optional `onGoHome` action.

## Usage

```tsx
import { NotFoundContent } from "@indiecrafts/packages-shared-system-pages/native";

<NotFoundContent
  eyebrow="404"
  title="Page not found"
  description="This page doesn't exist or has moved."
  homeLabel="Go home"
  onGoHome={() => router.replace("/")}
/>;
```

## Source

`code/packages/shared/system-pages/src/native/NotFoundContent.tsx`
