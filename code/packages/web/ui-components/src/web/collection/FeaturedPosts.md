# FeaturedPosts

> `code/packages/ui-components/src/web/collection/FeaturedPosts.tsx`

**Use when** you want an editorial "Featured" block — an optional large lead post (the same full-bleed image + gradient scrim as `PostHero`, at card size) plus a grid of compact `BlogCard`-style cards for the rest. Built for the blog's `module.blog-featured`; generic over already-resolved data, so any "featured posts" surface can reuse it.

## Props

| Prop      | Type             | Notes                                                          |
| --------- | ---------------- | -------------------------------------------------------------- |
| `heading` | `string`         | Optional section title.                                        |
| `lead`    | `PostCardItem`   | Optional — renders large, spanning 2 columns/rows in the grid. |
| `items`   | `PostCardItem[]` | The rest of the posts, as compact cards.                       |

`PostCardItem` (`@indiecrafts/packages-web-ui-components/shared/types`): `_key`, `href`, `title`, `image?`, `lqip?`, `category?`, `author?`, `date?` — every field already resolved by the host.

## Notes

- Renders nothing when there's no `lead` and `items` is empty.
- No `lead` falls back to a plain grid of compact cards.
- Plain `<a href>` (resolved hrefs), whole-card click via a stretched overlay link — matches `BlogCard`/`PostHero`.
- Container-query sized (`@container`) — column count and the lead's span grow with the block's own width, not the viewport.
