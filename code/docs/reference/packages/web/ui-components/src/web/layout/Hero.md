---
title: "Page hero"
description: "Lead hero band with eyebrow, rich title, subtitle, and an optional CTA."
status: stable
---

# Page hero

> The lead band: eyebrow, large rich title, subtitle, and an optional CTA.

## Purpose

`Hero` renders the page's lead band — an eyebrow, a large title that accents a word in brand via the `[[…]]` rich-title syntax, a subtitle, and an optional CTA. It is centered with generous vertical rhythm and wraps its content in `ModuleSection`. It renders nothing when there is no title. The `inline` flag switches the section chrome for inline body embeds.

## Exports

- `Hero(props)` — the hero component, typed as `HeroModule` plus an optional `inline` flag.

## Usage

```tsx
import { Hero } from "@indiecrafts/packages-web-ui-components/web/layout/Hero";

<Hero
  eyebrow="New"
  title="Build sites [[faster]]"
  subtitle="A config-first template."
  cta={{ link: { href: "/start", label: "Get started" } }}
/>;
```

## Source

`code/packages/web/ui-components/src/web/layout/Hero.tsx`
