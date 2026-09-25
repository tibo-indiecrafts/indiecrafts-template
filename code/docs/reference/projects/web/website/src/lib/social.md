---
title: "Social profile links"
description: "Builds the ordered, render-ready list of the site's social profiles shared by the footer and the Organization JSON-LD."
status: stable
---

# Social profile links

> One source for social links — the footer follow block and the `sameAs` JSON-LD.

## Purpose

Turns the `siteSettings.social` object into an ordered list of ready-to-render social profiles. It is the single source shared by the footer follow block and the Organization `sameAs` JSON-LD, so the two can never drift. Only non-empty profiles are included, the twitter handle is converted to its profile URL once, and brand marks come from the shared `ui-icons` brick.

## Exports

- `SocialLink` — type for one profile (platform, label, URL, brand mark).
- `socialLinks(social)` — the ordered, render-ready list of non-empty profiles.

## Usage

```ts
import { socialLinks } from "@/lib/social";

const links = socialLinks(settings.social);
```

## Source

`code/projects/web/surfaces/website/src/lib/social.ts`
