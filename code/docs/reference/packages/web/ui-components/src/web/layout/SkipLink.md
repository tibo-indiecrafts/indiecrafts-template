---
title: "Skip link"
description: "Skip-to-content link, the first focusable element on every surface."
status: stable
---

# Skip link

> The keyboard user's first Tab: jump past the header to the page's `<main id="main">`.

## Purpose

`SkipLink` is the one skip-to-content link for every web surface. The website mounts it in `DefaultLayout`; admin and app mount it first inside their locale layout. It sits off-screen (`-top-24`) and slides in on focus, so it stays in the tab order (never `display: none`). The target is the page's single `<main id="main" tabIndex={-1}>`. It has no hooks, so server and client components can render it. Each surface passes its own label from `messages/<locale>.json`.

## Exports

- `SkipLink({ label, href })` — the link; `href` defaults to `#main`.

## Usage

```tsx
import { SkipLink } from "@indiecrafts/packages-web-ui-components/web/layout/SkipLink";

<SkipLink label={t("skipToContent")} />;
```

## Source

`code/packages/web/ui-components/src/web/layout/SkipLink.tsx`
