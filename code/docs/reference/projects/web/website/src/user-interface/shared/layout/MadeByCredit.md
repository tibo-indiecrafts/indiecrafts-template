---
title: "Made-by credit"
description: "Footer maker credit whose brand name opens a tap-friendly link preview card."
status: stable
---

# Made-by credit

> "Made with `<name>`" where the name opens a link preview.

## Purpose

Renders the footer maker credit — "Made with `<name>`" — where the brand name opens a link preview card (og image, title, description, and domain). The data is edited in Sanity (`siteSettings.madeBy`) and passed in, so a client can keep, rebrand, or clear the credit. It renders nothing without a name. It uses a Popover (click / tap), not a HoverCard, so the preview works on touch where there is no hover; the preview card is itself the link. Keyboard: Enter or Space opens, Escape closes, focus is trapped and returned.

## Exports

- `MadeByCredit` — the credit component; takes a `madeBy` object.
- `MadeByData` — the type for the `madeBy` data (`name`, `href`, `image`, `title`, `description`, `domain`).

## Usage

```tsx
import { MadeByCredit } from "@/user-interface/shared/layout/MadeByCredit";

<MadeByCredit madeBy={settings.madeBy} />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/shared/layout/MadeByCredit.tsx`
