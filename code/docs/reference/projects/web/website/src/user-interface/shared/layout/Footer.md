---
title: "Site footer"
description: "Production site footer rendered from the Sanity navigation singleton, social links, and legal controls."
status: stable
---

# Site footer

> The production footer, colocated so the app owns its chrome end-to-end.

## Purpose

Renders the footer columns from the `navigation` singleton in Sanity (resolved by `getNavigation`) plus the social follow block, copyright, optional maker credit, an optional share control, and the CCPA "Do Not Sell or Share" link (shown only for opt-out visitors). Internal links always use `Link` from `@/i18n/routing` so locale prefixes resolve.

## Exports

- `Footer` — the footer component; presentational, driven by props resolved server-side (`name`, `tagline`, `company`, `logo`, `social`, `columns`, `madeBy`, `showDoNotSell`, `share`).

## Usage

```tsx
import { Footer } from "@/user-interface/shared/layout/Footer";

<Footer
  name={name}
  columns={nav.footerColumns}
  social={social}
  showDoNotSell={consentMode === "opt-out"}
/>;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/shared/layout/Footer.tsx`
