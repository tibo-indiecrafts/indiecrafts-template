---
title: "Blocks showcase section"
description: "Homepage section that renders the shared page-builder block renderers used by the blog body."
status: stable
---

# Blocks showcase section

> Renders the same `@indiecrafts/packages-web-ui-components` block renderers the blog body uses — proof the marketing page and blog posts share one component system.

## Purpose

Async server component in `src/user-interface/homepage/sections`. It renders a fixed set of demo block payloads (stat list, step list, card list, newsletter) through `renderBlock`, the same registry the blog body uses. The demo payloads stand in for Sanity-authored content; only the section chrome (eyebrow, title, body) reads from `namespace`, matching the other homepage showcases.

## Exports

- `BlocksShowcase` — async React component; props `id`, `namespace`.

## Usage

```tsx
import { BlocksShowcase } from "@/user-interface/homepage/sections/BlocksShowcase";

<BlocksShowcase id="blocks" namespace="pages.home.blocks.showcase" />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/homepage/sections/BlocksShowcase.tsx`
