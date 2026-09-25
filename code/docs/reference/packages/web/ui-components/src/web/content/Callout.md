---
title: "Callout"
description: "Renders a variant-styled callout aside around portable-text content."
status: stable
---

# Callout

> A variant-styled callout aside.

## Purpose

Renders a `module.callout` block: a variant-styled aside (info, success, warning, or danger) around portable-text content, with an optional CTA. The warning and danger variants use the `alert` ARIA role.

## Exports

- `Callout` — a variant-styled callout aside with an optional CTA.

## Usage

```tsx
import { Callout } from "@indiecrafts/packages-web-ui-components/web/content/Callout";

<Callout {...module} components={portableTextComponents} />;
```

## Source

`code/packages/web/ui-components/src/web/content/Callout.tsx`
