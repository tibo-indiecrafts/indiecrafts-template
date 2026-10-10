---
title: "Quote list"
description: "Async server component that renders stacked testimonial quotes with locale-aware quotation marks; takes a `QuoteListModule` and an optional `inline`."
status: stable
---

# Quote list

> Stacked testimonial pull quotes.

## Purpose

Renders a `module.quote-list` testimonials block as stacked pull quotes, each with an avatar, name, and role. It is an async server component that reads locale-aware quotation marks from `next-intl` (`typography.quoteStyle.primary`). Text sizes key off the container width. With `inline` set, `ModuleSection` renders it bare (`not-prose`, no gutters) for a rich-text body or a sidebar card. Without it, the block is a full-width section.

## Exports

- `QuoteList` — async server component; a stacked list of testimonial quotes with locale-aware quotation marks; takes a `QuoteListModule` and an optional `inline`.

## Usage

```tsx
import { QuoteList } from "@indiecrafts/packages-web-ui-components/web/collection/QuoteList";

<QuoteList {...module} />;
```

## Source

`code/packages/web/ui-components/src/web/collection/QuoteList.tsx`
