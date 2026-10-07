---
title: "Nav icon"
description: "Client component that resolves a free-text Reicon name to its glyph for a navigation link."
status: stable
---

# Nav icon

> Renders the Reicon glyph named by an editor in the `navigation` doc, or nothing when the name is unknown or empty.

## Purpose

`NavIcon` draws the glyph an editor picked for a header link (the `navigation` doc's `icon`, from the curated `GLYPHS` list) with the shared `ui-icons` `Icon`. It decorates navigation links in the client `Header`. It imports only the curated lucide glyphs; the earlier by-name Reicon lookup pulled the whole Reicon set into every page. An unknown or empty name renders nothing, so the link falls back to its label alone. The rendered glyph is `aria-hidden`.

## Exports

- `NavIcon` — a component taking `{ name?: string; size?: number }` (default `size` 16).

## Usage

```tsx
import { NavIcon } from "@/user-interface/shared/components/NavIcon";

<NavIcon name="shield-check" size={16} />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/shared/components/NavIcon.tsx`
