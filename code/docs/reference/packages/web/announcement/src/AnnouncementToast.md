---
title: "Announcement toast"
description: "A self-contained announcement card in the bottom overlay slot with an optional image and link, dismissed per content version."
status: stable
---

# Announcement toast

> An announcement card in the bottom overlay slot, with an image and link — not a sonner toast, so it never auto-dismisses a must-click link.

## Purpose

A self-contained card in the shared bottom overlay slot at every width (`fixed inset-x-4 bottom-4`, centered, `max-w-md`) — never the top, where the announcement bar (and its ×) and the confirmation toasts sit. It is a promotion, so it waits its turn in the overlay queue (`useOverlayTurn("announcement", …)`) until no required notice or prompt is on screen; its auto-dismiss timer starts only once it shows. It is not a sonner toast, because it carries an image and a link the user may click, and sonner's guidance says never to auto-dismiss such content. It announces itself with `role="status"` and `aria-live="polite"` without stealing focus. Dismiss is remembered per content `version` (a cookie), so a new toast re-shows after a prior close; the dismissed version is read hydration-safely. It is i18n-agnostic — resolved copy arrives as props.

## Exports

- `AnnouncementToast(props)` — the client component; takes the resolved `toast` (or `null`) and an optional `dismissLabel`.

## Usage

```tsx
import { AnnouncementToast } from "@indiecrafts/packages-web-announcement/AnnouncementToast";

<AnnouncementToast toast={toast} dismissLabel={t("announcement.dismiss")} />;
```

## Source

`code/packages/web/announcement/src/AnnouncementToast.tsx`
