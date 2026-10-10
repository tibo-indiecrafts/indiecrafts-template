---
title: "Sidebar resolution"
description: "Resolves which cards a page's sidebar shows, and builds the GROQ that reads them."
status: stable
---

# Sidebar resolution

> Picks a page's sidebar cards and builds the GROQ to read them.

## Purpose

`resolveSidebar` picks the cards a page shows. It checks the document's own `sidebar`, then its page type's entry in the settings. `custom` returns that level's cards. `none` returns no cards and stops. An unset mode reads as `inherit`, so the check goes to the next level. When no level decides, the settings' `default` cards apply.

`sidebarProjection` projects one `sidebar` field and expands its visible cards with a modules fragment. `sidebarSettingsQuery` reads the `sidebarSettings-<locale>` document for one page type. It throws when `pageType` is not letters only, because the query embeds that value.

## Exports

- `resolveSidebar(doc, settings)` — returns the cards to show (`B[]`).
- `sidebarProjection(modules)` — the GROQ projection of a `sidebar` field; hidden cards are dropped.
- `sidebarSettingsQuery(modules, pageType)` — the GROQ query for the locale's settings (`$locale`), narrowed to one page type.
- `SidebarChoice<B>` — a stored sidebar: `mode` plus `blocks`.
- `SidebarSettings<B>` — the settings narrowed to one page type: `default` plus `type`.

## Usage

```ts
import {
  resolveSidebar,
  sidebarProjection,
  sidebarSettingsQuery,
} from "@indiecrafts/packages-web-page-builder/sanity/sidebar";

const query = `*[_type == "page" && slug.current == $slug][0]{
  "sidebar": sidebar${sidebarProjection(MODULES_FRAGMENT)}
}`;
const settings = await fetch(sidebarSettingsQuery(MODULES_FRAGMENT, "page"), {
  locale,
});
const cards = resolveSidebar(page.sidebar, settings);
```

## Source

`code/packages/web/page-builder/src/sanity/sidebar.ts`
