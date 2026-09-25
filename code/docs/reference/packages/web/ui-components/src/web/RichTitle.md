---
title: "Rich title"
description: "Renders a heading from a string and promotes any [[word]] span to the brand accent colour."
status: stable
---

# Rich title

> A shared heading primitive that highlights `[[word]]` spans in the brand accent.

## Purpose

`RichTitle` renders a heading from a string and promotes any `[[word]]` span to
the brand accent colour using `splitHighlights`. It owns no typography — pass
the type scale via `className` (cn-merged, last wins). It is pure and
server-safe, so it works in RSC and client components, for app titles and
Sanity titles alike. The highlight is decorative only, so it needs no extra
ARIA.

## Exports

- `RichTitle` — a heading component. Props: `as` (`"h1" | "h2" | "h3" | "h4" | "p" | "span"`, default `"h2"`), optional `id` (for `aria-labelledby` targets), `className`, and a `children` string.

## Usage

```tsx
import { RichTitle } from "@indiecrafts/packages-web-ui-components/web/RichTitle";

<RichTitle as="h1" className="text-4xl font-semibold">
  Build [[fast]] sites
</RichTitle>;
```

## Source

`code/packages/web/ui-components/src/web/RichTitle.tsx`
