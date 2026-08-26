# TopicCards

> `code/packages/ui-components/src/web/layout/TopicCards.tsx`

**Use when** you want one to three categories or tags shown as large, clickable cards — a "browse by topic" section. Same full-bleed image + gradient-scrim card as `PostHero`/`FeaturedPosts`' lead card. Built for the blog's `module.blog-topic-cards`; unlike the other blog blocks it points at taxonomy (categories/tags), not posts, so it takes its own item shape instead of `PostCardItem`.

## Props

| Prop    | Type              | Notes                             |
| ------- | ----------------- | ---------------------------------- |
| `items` | `TopicCardItem[]` | 1–3 cards, in display order.       |

`TopicCardItem`: `_key`, `href`, `title`, `blurb?`, `image?`, `alt?` — every field already resolved by the host (the renderer dereferences the category/tag and builds the URL; the image is already a CDN url).

## Notes

- Columns follow the item count — 1 card fills the row, 2 or 3 split it evenly (`@container`-driven, not viewport-driven).
- Plain `<a href>` (resolved hrefs), matching the other renderers — the host localizes them.
- No `image` falls back to a solid muted backdrop so the overlaid text keeps contrast.
- `alt` is the editor's image alt text (`cards[].image.alt` in the Studio); falls back to `title` when unset, matching `PostCard`/`FeaturedPosts`' lead card.
- Renders nothing when `items` is empty.
