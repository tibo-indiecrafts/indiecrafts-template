---
title: "Post hero"
description: "Full-width lead-post media hero with title, category chip, excerpt, and byline over a gradient scrim."
status: stable
---

# Post hero

> The frontpage lead post — a full-width media hero with the title and byline overlaid on a scrim.

## Purpose

`PostHero` renders a large, full-width media hero for the frontpage lead post, with the title, category chip, excerpt, and author-and-date overlaid on a gradient scrim. It is data-driven: every value is already resolved (a plain `href`, image or video url, formatted `date`), so the host owns i18n and routing while this owns the layout. The whole card is clickable via the title link's stretched overlay; a video hero's play button sits above it and still opens the player in place. `headingLevel` picks `"h2"` when the hero sits inside a page or `"h1"` when it is the page's main heading.

## Exports

- `PostHero(props)` — the lead-post hero component.

## Usage

```tsx
import { PostHero } from "@indiecrafts/packages-web-ui-components/web/layout/PostHero";

<PostHero
  href="/blog/launch"
  title="We launched"
  excerpt="The story behind the release."
  image="https://cdn.example.com/launch.jpg"
  category={{ title: "News", href: "/blog/news" }}
  author="Alex"
  date="Sep 25, 2026"
  playLabel="Play video"
/>;
```

## Source

`code/packages/web/ui-components/src/web/layout/PostHero.tsx`
