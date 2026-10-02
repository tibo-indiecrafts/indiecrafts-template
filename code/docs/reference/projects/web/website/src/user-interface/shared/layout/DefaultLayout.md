---
title: "Default layout"
description: "Server component that assembles the production page chrome — header, footer, announcements, and locale suggestion."
status: stable
---

# Default layout

> The production chrome wrapper, owned end-to-end by the app.

## Purpose

Assembles the production page chrome and wraps page content. It fetches layout data (site settings, navigation, SEO, announcements, locale suggestion) in one batch keyed on the active locale, then renders the `Header`, `<main id="main">`, and `Footer`. Top-of-main chrome (announcement bar, toast, and language suggestion) is decided server-side from the cookie and `Accept-Language` so it never flashes. The announcement card mounts after every top strip (and the optional `subnav`), so from `sm` up it sits under all of them. The footer's CCPA "Do Not Sell" link is gated to opt-out (US/CCPA) visitors via `resolveConsentMode`.

## Exports

- `DefaultLayout` — async server component; accepts `children`, optional `header` / `footer` slots (boolean or node), and an optional `subnav` node.

## Usage

```tsx
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";

<DefaultLayout subnav={<CategoryNav />}>{children}</DefaultLayout>;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/shared/layout/DefaultLayout.tsx`
