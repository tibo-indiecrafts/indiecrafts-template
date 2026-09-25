---
title: "Module renderer"
description: "Dispatcher that renders blog-specific and generic page-builder modules."
status: stable
---

# Module renderer

> Special-cases the blog's own module types and passes the rest to the shared registry.

## Purpose

The `Modules` component drives the blog page-builder. It iterates a module array, skips hidden entries, and dispatches each: the blog-specific modules (post and frontpage blocks that fetch and render live posts) are special-cased through an internal switch, and every other module is a generic block rendered by `@indiecrafts/packages-web-ui-components` via `renderBlock`. It returns `null` for the empty-array case, so route callers fall back to their hard-coded default layout.

## Exports

- `Modules` — async server component; takes `modules` (`AnyModule[]`) and `context` (`ModuleContext`).
- `ModuleContext` — type: `{ locale: Locale; post?: Post }`.

## Usage

```tsx
import { Modules } from "@indiecrafts/modules-web-blog/user-interface/renderers/ModuleRenderer";

<Modules modules={blog.frontpageModules} context={{ locale }} />;
```

## Source

`code/modules/web/blog/src/user-interface/renderers/ModuleRenderer.tsx`
