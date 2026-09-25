---
title: "Shell overlays"
description: "The compliance and version overlays composition root for the app shell."
status: stable
---

# Shell overlays

> A thin root that mounts the consent, legal, and version overlays.

## Purpose

Client component that mounts the compliance and version overlays for the app shell, in `[locale]/layout`. It is a thin composition root: each overlay is its own file under `overlays/` (`ConsentGate`, `LegalGate`), over the shared consent and legal stores, plus the `UpdatePrompt`. `mode` is the geo-resolved consent mode; `gpcSignal` is the server-detected `Sec-GPC: 1` header.

## Exports

- `ShellOverlays` — the client component. Props: `commit`, `mode` (`ConsentMode`), `gpcSignal`.

## Usage

```tsx
import { ShellOverlays } from "@/user-interface/ShellOverlays";

<ShellOverlays
  commit={buildInfo.commit}
  mode={consentMode}
  gpcSignal={gpcSignal}
/>;
```

## Source

`code/projects/web/surfaces/app/src/user-interface/ShellOverlays.tsx`
