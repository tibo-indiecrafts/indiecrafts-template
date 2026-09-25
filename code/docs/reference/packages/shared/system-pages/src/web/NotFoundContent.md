---
title: "Not-found content (web)"
description: "Presentational web 404 content card with an injected, locale-aware home link."
status: stable
---

# Not-found content (web)

> The web 404 content card — Next-agnostic via an injected `LinkComponent`.

## Purpose

Renders the centered 404 card for web surfaces. The app's `not-found.tsx` route resolves the copy and wraps this in its own chrome. The home link is injected as `LinkComponent` (default a plain `<a href>`), so the website passes its `@/i18n/routing` `Link` while a plain-React host takes the default. Injecting it keeps the brick Next-agnostic, with no `next-intl` dependency.

## Exports

- `NotFoundContent` — the DOM 404 card.
- `NotFoundContentProps` — the base copy contract plus optional `LinkComponent` and `homeHref`.

## Usage

```tsx
import { NotFoundContent } from "@indiecrafts/packages-shared-system-pages/web";
import { Link } from "@/i18n/routing";

<NotFoundContent
  eyebrow="404"
  title="Page not found"
  description="This page doesn't exist or has moved."
  homeLabel="Go home"
  LinkComponent={Link}
/>;
```

## Source

`code/packages/shared/system-pages/src/web/NotFoundContent.tsx`
