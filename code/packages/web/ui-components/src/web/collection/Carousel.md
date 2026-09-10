# Carousel

> `code/packages/ui-components/src/web/collection/Carousel.tsx`

**Use when** you want a horizontally scrolling row of post cards — several visible at once, prev/next buttons to page through the rest. Built for the blog's `module.blog-collection` (a pinned, ordered selection of posts); generic over already-resolved data, so any curated-collection surface can reuse it.

## Props

| Prop      | Type                    | Notes                                          |
| --------- | ----------------------- | ---------------------------------------------- |
| `heading` | `string`                | Optional section title.                        |
| `intro`   | `string`                | Optional intro text under the heading.         |
| `items`   | `PostCardItem[]`        | The posts, in display order.                   |
| `labels`  | `{ prev, next, slide }` | i18n strings for the buttons + the slide role. |

`PostCardItem` (`@indiecrafts/packages-web-ui-components/shared/types`): `_key`, `href`, `title`, `image?`, `lqip?`, `category?`, `author?`, `date?` — every field already resolved by the host.

## Notes

- `"use client"` — the prev/next buttons scroll the track with a `ref` + `scrollBy`.
- CSS scroll-snap (`overflow-x-auto snap-x snap-mandatory`), no carousel library. Each card is `snap-start` at a fixed `basis-80` width so several show at once; the buttons nudge by roughly one card width.
- Accessibility follows the W3C carousel pattern: the region is `aria-roledescription="carousel"` with a label (the heading, or `labels.slide` as a fallback); each slide is `role="group" aria-roledescription={labels.slide}` with `aria-posinset`/`aria-setsize` — assistive tech announces "N of M" natively, so no "of" string needs translating.
- Respects `prefers-reduced-motion`: the track's `scroll-behavior` drops to `auto` under `motion-reduce`, and `scrollBy` is called with no explicit `behavior`, so it inherits the CSS value.
- Renders nothing when `items` is empty.
