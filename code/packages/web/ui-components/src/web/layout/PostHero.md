# PostHero

> `code/packages/ui-components/src/web/layout/PostHero.tsx`

**Use when** you want a large, full-width lead post — the frontpage's "Big Hero". A full-bleed cover image or inline-playable video with a gradient scrim, a category chip, the title, excerpt, and author · date overlaid at the bottom. Built for the blog's `module.blog-hero`; generic over already-resolved data, so any "featured post" surface can reuse it.

## Props

| Prop           | Type               | Notes                                                                     |
| -------------- | ------------------ | ------------------------------------------------------------------------- |
| `href`         | `string`           | Resolved post URL. Whole-card click (stretched over the title).           |
| `title`        | `string`           | The post title.                                                           |
| `excerpt`      | `string`           | Optional teaser under the title.                                          |
| `image`        | `string`           | Cover image URL.                                                          |
| `lqip`         | `string`           | Optional blur placeholder for the image.                                  |
| `alt`          | `string`           | Image alt text; falls back to `title`.                                    |
| `video`        | `string`           | Optional video URL/embed — plays in place via `FeaturedMedia`, no dialog. |
| `category`     | `{ title, href? }` | Optional category chip. No `href` renders plain text.                     |
| `author`       | `string`           | Optional author name.                                                     |
| `date`         | `string`           | Optional formatted publish date.                                          |
| `playLabel`    | `string`           | Accessible label for the video play button (i18n, host-provided).         |
| `headingLevel` | `"h1" \| "h2"`     | The title's heading tag. Default `"h2"`.                                  |

## Notes

- Reuses `FeaturedMedia` for the image/video — same play-in-place behaviour as every other post card.
- Plain `<a href>` (resolved hrefs), matching the other renderers — the host localizes them.
- No `image`/`video` falls back to a solid dark backdrop so the overlaid text keeps contrast.
- Container-query sized (`@container`) — aspect ratio, padding, and type scale grow with the hero's own width, not the viewport.
