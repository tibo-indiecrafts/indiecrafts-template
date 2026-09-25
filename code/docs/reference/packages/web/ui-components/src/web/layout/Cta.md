---
title: "Module CTA button"
description: "Renders a page-builder CTA button from a resolved link, or nothing when href or label is missing."
status: stable
---

# Module CTA button

> A CTA button rendered from the page-builder `cta` block's resolved link.

## Purpose

`ModuleCta` renders the button for a page-builder `cta` block. It uses the resolved `href` from the link fragment — internal Sanity refs are already converted to `/blog/<slug>` strings. It requires both `href` and `label`, with no English fallback: an editor who omits a label sees no button, which surfaces the missing data instead of shipping untranslated copy. The `variant` picks primary, secondary, or ghost styling; `newTab` opens in a new tab.

## Exports

- `ModuleCta({ cta, className })` — the CTA button component.

## Usage

```tsx
import { ModuleCta } from "@indiecrafts/packages-web-ui-components/web/layout/Cta";

<ModuleCta
  cta={{ variant: "primary", link: { href: "/pricing", label: "See pricing" } }}
/>;
```

## Source

`code/packages/web/ui-components/src/web/layout/Cta.tsx`
