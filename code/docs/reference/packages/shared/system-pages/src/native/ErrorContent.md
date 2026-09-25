---
title: "Error screen (native)"
description: "Presentational React Native 500/error screen with a retry button, themed from the shared tokens."
status: stable
---

# Error screen (native)

> The native error (500) screen — same copy contract as web, retry owned by the app.

## Purpose

Renders the centered error screen for React Native surfaces. It shares the `ErrorContentProps` copy contract with the web renderer and owns its own background, so it reads in light and dark even when no boundary wraps it. The app provides `onRetry`.

## Exports

- `ErrorContent` — the React Native error screen; a filled brand retry button matches the web primary.
- `ErrorContentProps` — re-exported copy contract (`title`, `description`, `retryLabel`, `onRetry`).

## Usage

```tsx
import { ErrorContent } from "@indiecrafts/packages-shared-system-pages/native";

<ErrorContent
  title="Something went wrong"
  description="An unexpected error occurred. Please try again."
  retryLabel="Try again"
  onRetry={() => reset()}
/>;
```

## Source

`code/packages/shared/system-pages/src/native/ErrorContent.tsx`
