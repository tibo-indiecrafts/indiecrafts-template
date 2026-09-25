---
title: "Announcement toast"
description: "A self-contained fixed corner card announcement with an optional image and link, dismissed per content version."
status: stable
---

# Announcement toast

> A fixed corner announcement card with an image and link — not a sonner toast, so it never auto-dismisses a must-click link.

## Purpose

A self-contained, fixed top-right card. It is not a sonner toast, because it carries an image and a link the user may click, and sonner's guidance says never to auto-dismiss such content. It announces itself with `role="status"` and `aria-live="polite"` without stealing focus. Dismiss is remembered per content `version` (a cookie), so a new toast re-shows after a prior close; the dismissed version is read hydration-safely. It is i18n-agnostic — resolved copy arrives as props.

## Exports

- `AnnouncementToast(props)` — the client component; takes the resolved `toast` (or `null`) and an optional `dismissLabel`.

## Usage

```tsx
import { AnnouncementToast } from "@indiecrafts/packages-web-announcement/AnnouncementToast";

<AnnouncementToast toast={toast} dismissLabel={t("announcement.dismiss")} />;
```

## Source

`code/packages/web/announcement/src/AnnouncementToast.tsx`
