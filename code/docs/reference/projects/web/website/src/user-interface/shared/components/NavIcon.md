---
title: "Nav icon"
description: "Client component that resolves a free-text Reicon name to its glyph for a navigation link."
status: stable
---

# Nav icon

> Renders the Reicon glyph named by an editor in the `navigation` doc, or nothing when the name is unknown or empty.

## Purpose

`NavIcon` maps a free-text Reicon name (typed by an editor, e.g. `"ShieldCheck"`) to its glyph via the shared `ui-icons` brick. It is a small client component used to decorate navigation links. An unknown or empty name renders nothing, so the link falls back to its label alone. The rendered glyph is `aria-hidden`.

## Exports

- `NavIcon` — a client component taking `{ name?: string; size?: number }` (default `size` 16).

## Usage

```tsx
import { NavIcon } from "@/user-interface/shared/components/NavIcon";

<NavIcon name="ShieldCheck" size={16} />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/shared/components/NavIcon.tsx`
