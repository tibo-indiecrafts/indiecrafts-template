---
title: "Quote list"
description: "Async server component that renders stacked testimonial quotes with locale-aware quotation marks."
status: stable
---

# Quote list

> Stacked testimonial pull quotes.

## Purpose

Renders a `module.quote-list` testimonials block as stacked pull quotes, each with an avatar, name, and role. It is an async server component that reads locale-aware quotation marks from `next-intl` (`typography.quoteStyle.primary`).

## Exports

- `QuoteList` — async server component; a stacked list of testimonial quotes with locale-aware quotation marks.

## Usage

```tsx
import { QuoteList } from "@indiecrafts/packages-web-ui-components/web/collection/QuoteList";

<QuoteList {...module} />;
```

## Source

`code/packages/web/ui-components/src/web/collection/QuoteList.tsx`
