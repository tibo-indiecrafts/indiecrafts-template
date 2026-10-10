> `code/packages/web/ui-components/src/web/collection/FeaturedPosts.tsx`

**Use when** you want a "Featured posts" block on any page — under an optional header (eyebrow, heading, intro, "view all" link), either a large lead post over a grid of compact cards (`grid`) or a lead card beside a short list (`editorial`, the home page's strip). Built for the blog's `module.blog-featured`; generic over already-resolved data.

## Props

| Prop      | Type                    | Notes                                                        |
| --------- | ----------------------- | ------------------------------------------------------------ |
| `layout`  | `"grid" \| "editorial"` | Default `grid`. `editorial` renders `FeaturedEditorial`.     |
| `eyebrow` | `string`                | Optional small label above the heading.                      |
| `heading` | `string`                | Optional section title.                                      |
| `intro`   | `string`                | Optional sentence under the heading.                         |
| `viewAll` | `{ label, href }`       | Optional link beside the header (e.g. to the blog).          |
| `lead`    | `PostCardItem`          | Optional — the large card (in `grid`, spans 2 columns/rows). |
| `items`   | `PostCardItem[]`        | The rest of the posts.                                       |
| `anchor`  | `string`                | Optional section `id`; the heading gets `<anchor>-title`.    |

`PostCardItem` (`@indiecrafts/packages-web-ui-components/shared/types`): `_key`, `href`, `title`, `image?`, `lqip?`, `category?`, `author?`, `date?`, `excerpt?` — every field already resolved by the host.

## Notes

- Renders nothing when there's no `lead` and `items` is empty.
- `grid` with no `lead` falls back to a plain grid of compact cards.
- Plain `<a href>` (resolved hrefs), whole-card click via a stretched overlay link — matches `BlogCard`/`PostHero`.
- Container-query sized (`@container`): columns, the lead's span and the heading size follow the block's own width, so it fits a full-width section, a narrow column and a page with a sidebar.
