# SpotlightRow

> `code/packages/ui-components/src/web/collection/SpotlightRow.tsx`

**Use when** you want a curated "spotlight" on a single topic — a heading (+ optional subheading and a "view all" link) over a row of compact post cards. Built for the blog's `module.blog-category-spotlight`; generic over already-resolved data, so any curated-collection surface can reuse it. Shares `PostCard` with `FeaturedPosts`, so the two primitives render identical cards.

## Props

| Prop         | Type                              | Notes                                                              |
| ------------ | --------------------------------- | ------------------------------------------------------------------ |
| `heading`    | `string`                          | The section title.                                                 |
| `subheading` | `string`                          | Optional supporting line under the heading.                        |
| `items`      | `PostCardItem[]`                  | The posts, as compact cards.                                       |
| `viewAll`    | `{ label: string; href: string }` | Optional — renders a link aligned to the heading row's right edge. |

`PostCardItem` (`@indiecrafts/packages-web-ui-components/shared/types`): `_key`, `href`, `title`, `image?`, `lqip?`, `category?`, `author?`, `date?` — every field already resolved by the host.

## Notes

- Renders nothing when `items` is empty.
- Plain `<a href>` (resolved hrefs), whole-card click via a stretched overlay link — matches `BlogCard`/`PostHero`/`FeaturedPosts`.
- Container-query sized (`@container`) — column count grows with the block's own width, not the viewport.
