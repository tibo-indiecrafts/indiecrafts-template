---
title: "Page sidebar"
description: "Puts a page's content beside the sidebar cards set for its page type."
status: stable
---

# Page sidebar

> Wraps a page's content with its sidebar cards.

## Purpose

Async server component. It puts a page's content beside its sidebar cards. The cards come from `getSidebar`: the settings for page type `page` in Site web → Barre latérale, or the document's own `choice`. The cards render through `Modules` with `sidebar: true` in the context. `WithSidebar` labels the aside with `common.sidebarLabel`. With no card, the content renders unchanged at full width. Posts do not use this component. They build their sidebar beside the body with `postSidebar`.

## Exports

- `PageSidebar` — props `locale`, `page` (`SidebarPage`), optional `choice` (`SidebarChoice<AnyModule>`), and `children`.

## Usage

```tsx
import { PageSidebar } from "@/user-interface/shared/layout/PageSidebar";

<PageSidebar locale={locale} page="page" choice={page.sidebar}>
  <Modules modules={page.sections} context={{ locale }} />
</PageSidebar>;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/shared/layout/PageSidebar.tsx`
