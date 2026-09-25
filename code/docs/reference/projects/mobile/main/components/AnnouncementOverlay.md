---
title: "Announcement overlay"
description: "The signed-in mobile announcement chrome — a top banner strip and a bottom toast card."
status: stable
---

# Announcement overlay

> The signed-in announcement banner and toast for the mobile shell.

## Purpose

Renders the logged-in-only announcement chrome: a top banner strip and a bottom toast card, both fed by the shared api Worker's `/v1/announcements` (surface `mobile`). It renders only when signed in and online. Colors come from the shared `useTheme` tokens. Each dismiss is remembered per content `version` via `createNativeStore`, so a new announcement re-shows.

## Exports

- `AnnouncementOverlay` — the overlay component. Prop: `locale` (`Locale`) used to fetch localized announcements.

## Usage

```tsx
import { AnnouncementOverlay } from "@/components/AnnouncementOverlay";

<AnnouncementOverlay locale="en" />;
```

## Source

`code/projects/mobile/surfaces/main/components/AnnouncementOverlay.tsx`
