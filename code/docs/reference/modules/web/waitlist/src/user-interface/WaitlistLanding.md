---
title: "Waitlist landing"
description: "Server component that renders the waitlist page content from the settings singleton."
status: stable
---

# Waitlist landing

> The full-page waitlist view, sharing the same form as the page-builder block.

## Purpose

Renders the waitlist landing content. It resolves per-locale copy from the `waitlistSettings` singleton and renders the shared `WaitlistForm` in its card variant. The app route wraps this in the site chrome and owns the feature gate and SEO; the component imports only packages, never the app.

## Exports

- `WaitlistLanding({ locale })` — an async server component returning the waitlist section.

## Usage

```tsx
import { WaitlistLanding } from "@indiecrafts/modules-web-waitlist/user-interface/WaitlistLanding";

<WaitlistLanding locale={locale} />;
```

## Source

`code/modules/web/waitlist/src/user-interface/WaitlistLanding.tsx`
