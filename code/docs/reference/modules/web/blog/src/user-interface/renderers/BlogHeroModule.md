---
title: "Big hero renderer"
description: "Frontpage block rendering a single pinned or latest post as a large hero."
status: stable
---

# Big hero renderer

> Maps one pinned or latest post onto the generic `PostHero` primitive.

## Purpose

`BlogHeroModule` renders the frontpage "Big Hero" block. It fetches either the editor's pinned post (`source === "pinned"`) or the latest published one (`blogHeroQuery`) and maps it onto the generic `PostHero` primitive, including cover image or inline video, category, author, and date. Meta shows only when `showMeta` is on and the author taxonomy is enabled. It returns `null` when no post matches.

## Exports

- `BlogHeroModule` — async server component; takes `module` (`BlogHeroModule`) and `locale` (`Locale`).

## Usage

```tsx
import { BlogHeroModule } from "@indiecrafts/modules-web-blog/user-interface/renderers/BlogHeroModule";

<BlogHeroModule module={m} locale={locale} />;
```

## Source

`code/modules/web/blog/src/user-interface/renderers/BlogHeroModule.tsx`
