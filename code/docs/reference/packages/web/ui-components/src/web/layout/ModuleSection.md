---
title: "Module section wrapper"
description: "Shared chrome that renders a module as a full-width section or as an inline body embed."
status: stable
---

# Module section wrapper

> Shared chrome for modules that double as full-width slots and inline body embeds.

## Purpose

`ModuleSection` is the shared wrapper for modules that serve both as full-width `postModules` slots and as inline body embeds. As a slot it is a centered `max-w-6xl` section with page gutters and vertical rhythm. Inline — rendered inside the article's `.prose` column, which already owns width and horizontal padding — it drops the gutter (which would double-pad and squeeze the module on mobile) and adds `not-prose` plus modest vertical spacing so the typography plugin does not restyle the module's own markup.

## Exports

- `ModuleSection({ anchor, inline, className, children })` — the section wrapper component.

## Usage

```tsx
import { ModuleSection } from "@indiecrafts/packages-web-ui-components/web/layout/ModuleSection";

<ModuleSection anchor="features" className="py-16">
  {children}
</ModuleSection>;
```

## Source

`code/packages/web/ui-components/src/web/layout/ModuleSection.tsx`
