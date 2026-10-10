---
title: "Callout"
description: "Renders a variant-styled callout aside around portable-text content."
status: stable
---

# Callout

> A variant-styled callout aside.

## Purpose

Renders a `module.callout` block: a variant-styled aside (info, success, warning, or danger) around portable-text content, with an optional CTA. Every variant uses the `note` ARIA role (static content; `alert` would interrupt on load). With `inline` set, `ModuleSection` renders it bare (`not-prose`, no gutters) for a rich-text body or a sidebar card. Without it, the block is a full-width section.

## Exports

- `Callout` — a variant-styled callout aside with an optional CTA; takes an optional `inline`.

## Usage

```tsx
import { Callout } from "@indiecrafts/packages-web-ui-components/web/content/Callout";

<Callout {...module} components={portableTextComponents} />;
```

## Source

`code/packages/web/ui-components/src/web/content/Callout.tsx`
