---
title: "Studio layout"
description: "Minimal root layout that gives the embedded Studio its own HTML document."
status: stable
---

# Studio layout

> A bare `<html>`/`<body>` shell for the Studio route, which lives outside the locale segment.

## Purpose

`StudioLayout` is the root layout for the embedded Sanity Studio at `/studio`. The site-wide `src/app/layout.tsx` is a passthrough — `<html>` and `<body>` normally live under `[locale]/layout.tsx` to stamp the locale — but Studio routes sit outside `[locale]/`, so without this file Next throws a "Missing `<html>` and `<body>` tags" error. The markup stays minimal: the Studio bundle owns its own styles, theme, fonts, and chrome.

## Exports

- `default` (`StudioLayout`) — server component; wraps `children` in a minimal `<html lang="en">`/`<body>`.

## Source

`code/projects/web/surfaces/website/src/app/studio/layout.studio.tsx`
