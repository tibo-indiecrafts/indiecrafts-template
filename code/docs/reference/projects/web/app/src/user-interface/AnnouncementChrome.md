---
title: "Announcement chrome"
description: "The logged-in-only announcement banner and toast for the app surface."
status: stable
---

# Announcement chrome

> A signed-in-only announcement banner and toast, from the api Worker.

## Purpose

Client component that renders the logged-in-only announcement chrome. Mounted in `[locale]/layout` only when Clerk is configured, so `useAuth` has its provider. It fetches the shared api Worker's public announcements for the app surface and locale only when the visitor is signed in, then renders the shared `AnnouncementBar` (top strip) and `AnnouncementToast`. The copy is authored in Sanity; only the dismiss and copy labels come from `messages.announcement`.

## Exports

- `AnnouncementChrome` — the client component (no props).

## Usage

```tsx
import { AnnouncementChrome } from "@/user-interface/AnnouncementChrome";

<AnnouncementChrome />;
```

## Source

`code/projects/web/surfaces/app/src/user-interface/AnnouncementChrome.tsx`
