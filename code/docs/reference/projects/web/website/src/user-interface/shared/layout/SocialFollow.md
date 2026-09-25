---
title: "Social follow"
description: "Footer block that renders the site's social profiles as brand-colored icon links from Sanity."
status: stable
---

# Social follow

> The footer's social-profile icon links.

## Purpose

Renders the site's social profiles as icon links, driven by Sanity (`siteSettings.social`) through `socialLinks` — the same source that feeds the Organization `sameAs` JSON-LD. It renders nothing when no profile is set, so the eyebrow never shows alone. Each icon rests in `muted-foreground` and, on hover or focus, adopts its platform's official brand color (exposed as a `--brand` custom property). `rel="me"` marks each link as the site's verified profile.

## Exports

- `SocialFollow` — the follow block; takes `social` (the Sanity social settings) and a `label`.

## Usage

```tsx
import { SocialFollow } from "@/user-interface/shared/layout/SocialFollow";

<SocialFollow social={settings.social} label={t("follow")} />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/shared/layout/SocialFollow.tsx`
