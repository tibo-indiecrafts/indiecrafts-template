---
title: "Error content (web)"
description: "Presentational web 500 error content card; the app's error boundary resolves the copy."
status: stable
---

# Error content (web)

> The web error (500) content card — resolved copy in, site chrome owned by the app.

## Purpose

Renders the centered 500 error card for web surfaces. It is a client component (`"use client"`). The app's client `error.tsx` boundary resolves the copy from bundled messages (never Sanity, so it renders even when Sanity is down) and wraps this in its own chrome. The retry button comes from the shared web UI brick.

## Exports

- `ErrorContent` — the DOM error card; takes `title`, `description`, `retryLabel`, `onRetry`, and an optional `brand` slot (the host's logo, above the copy).
- `ErrorContentProps` — the copy contract plus the optional `brand` slot.

## Usage

```tsx
import { ErrorContent } from "@indiecrafts/packages-web-system-pages/web";

<ErrorContent
  title="Something went wrong"
  description="An unexpected error occurred. Please try again."
  retryLabel="Try again"
  onRetry={() => reset()}
/>;
```

## Source

`code/packages/web/system-pages/src/web/ErrorContent.tsx`
