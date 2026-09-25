---
title: "Mobile shell overlays"
description: "Renders the mobile app's global overlays: offline, announcements, consent, legal re-acceptance, version, and locale suggestion."
status: stable
---

# Mobile shell overlays

> Every top- and bottom-anchored overlay the mobile shell needs, mounted once.

## Purpose

Mounted in `app/_layout.tsx`, this file gathers the mobile shell's global overlays and their gates. It geo-resolves the consent mode once on launch (via the api `/v1/geo`, since native has no `cf-ipcountry` header), then renders the offline banner, logged-in announcements, the marketing nudge, the consent banner, the legal re-acceptance prompt, a version-update banner, and a first-run locale suggestion. Each overlay owns its own visibility gate so nothing flashes before its state resolves.

## Exports

- `ShellOverlays` — React component; props `locale`, `chooseLocale`, and `hasChoice` drive the locale-switch banner.

## Usage

```tsx
import { ShellOverlays } from "@/components/ShellOverlays";

<ShellOverlays
  locale={locale}
  chooseLocale={setStoredLocale}
  hasChoice={hasStoredLocale}
/>;
```

## Source

`code/projects/mobile/surfaces/main/components/ShellOverlays.tsx`
