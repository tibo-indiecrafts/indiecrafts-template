---
title: "Navigation read path"
description: "Resolves the Sanity navigation singleton into localized header items and footer columns."
status: stable
---

# Navigation read path

> The sole runtime source for the header menu and footer columns — no config fallback.

## Purpose

Reads the `navigation` Sanity singleton and resolves it per locale into header items (leaves or dropdown groups) and footer columns. Labels fall back to the default locale; internal links resolve to typed route keys and are skipped when the target page is feature-disabled (no dead links); external links pass through. Any fetch error returns the empty shape so the site always renders. Wrapped in React `cache()`.

## Exports

- `NavLeaf` — type: a resolved terminal link (internal route key or external URL) with label, `newTab`, optional `icon` / `description`.
- `NavGroup` — type: a header item opening a dropdown of leaves.
- `NavItem` — type: `NavLeaf | NavGroup`.
- `FooterColumn` — type: `{ title, links }`.
- `Navigation` — type: `{ header, footerColumns }`.
- `getNavigation(locale)` — cached fetcher returning the resolved `Navigation`.

## Usage

```ts
import { getNavigation } from "@/lib/navigation";

const { header, footerColumns } = await getNavigation("en");
```

## Source

`code/projects/web/surfaces/website/src/lib/navigation.ts`
