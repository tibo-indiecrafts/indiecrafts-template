---
title: "Offline banner (native)"
description: "Non-blocking React Native top strip shown while the device is offline."
status: stable
---

# Offline banner (native)

> A top strip shown while `online` is false; renders nothing otherwise.

## Purpose

Renders a non-blocking strip at the top of a React Native screen while offline. Both the copy (`message`) and connectivity (`online`) are injected, so the brick stays free of a native connectivity dependency; the app owns detection (for example netinfo). `accessibilityLiveRegion` announces the change to TalkBack without stealing focus.

## Exports

- `OfflineBanner` — the React Native offline strip; takes `message` and `online`.

## Usage

```tsx
import { OfflineBanner } from "@indiecrafts/packages-shared-system-pages/native";

<OfflineBanner
  message="You're offline — some features may be unavailable."
  online={isOnline}
/>;
```

## Source

`code/packages/shared/system-pages/src/native/OfflineBanner.tsx`
