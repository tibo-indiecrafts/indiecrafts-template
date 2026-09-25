---
title: "Skip link"
description: "Skip-to-content link — the first focusable element in the body, targeting the main region."
status: stable
---

# Skip link

> Keyboard skip-to-content, always in the tab order.

## Purpose

Renders the skip-to-content link — the first focusable element in `<body>` — which targets the `<main id="main" tabIndex={-1}>` rendered by `DefaultLayout`. It is positioned off-screen with `-top-24` (not `sr-only`) so the `top` transition can animate when focus arrives, and it is rendered on every page load, never hidden with `display: none` or `visibility: hidden`, which would drop it from the tab flow. The focus ring stacks a brand-color ring and a background-color offset so it stays visible against any theme.

## Exports

- `SkipLink` — the skip link component; takes no props.

## Usage

```tsx
import { SkipLink } from "@/user-interface/shared/layout/SkipLink";

<SkipLink />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/shared/layout/SkipLink.tsx`
