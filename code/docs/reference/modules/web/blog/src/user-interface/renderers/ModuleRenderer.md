---
title: "Module renderer"
description: "Dispatcher that renders blog-specific and generic page-builder modules."
status: stable
---

# Module renderer

> Special-cases the blog's own module types and passes the rest to the shared registry.

## Purpose

The `Modules` component drives every block list that can hold blog blocks: the blog's frontpage and post layouts, site pages, the home page and the sidebar. It iterates a module array, skips hidden entries, and dispatches each. An internal switch handles the blog blocks, which fetch and render live posts. Every other module is a generic block that `@indiecrafts/packages-web-ui-components` renders via `renderBlock`. It returns `null` for the empty-array case, so route callers fall back to their hard-coded default layout.

Outside a post, it skips the blocks that describe the post being read (`blog-toc`, `blog-related`, `blog-post-content`). With `context.sidebar`, each block sits in a `SidebarCard`: generic blocks render `inline`, and the post lists render as compact `PostLinks`. The `blog-toc` card is hidden below `lg`, because `MobileToc` shows it above the article. Outside a sidebar, blog blocks that paint no `id` get a wrapper `div` with their `anchor`.

## Exports

- `Modules` — async server component; takes `modules` (`AnyModule[]`) and `context` (`ModuleContext`).
- `ModuleContext` — type: `{ locale: Locale; post?: Post; sidebar?: boolean; postSidebar?: PostSidebar }`. `postSidebar` is the post's sidebar that `blog-post-content` paints beside the body.

## Usage

```tsx
import { Modules } from "@indiecrafts/modules-web-blog/user-interface/renderers/ModuleRenderer";

<Modules modules={blog.frontpageModules} context={{ locale }} />;
```

## Source

`code/modules/web/blog/src/user-interface/renderers/ModuleRenderer.tsx`
