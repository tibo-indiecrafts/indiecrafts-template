> `code/packages/web/ui-components/src/web/collection/FeaturedEditorial.tsx`

**Use when** a featured strip should read differently from a uniform grid: the first post as a large card (image, category, title, excerpt, author · date) beside up to three compact rows. It is the `editorial` layout of `FeaturedPosts`; use it through that component.

## Props

| Prop    | Type             | Notes                                             |
| ------- | ---------------- | ------------------------------------------------- |
| `posts` | `PostCardItem[]` | The lead first, then the rows (only 3 are shown). |

## Notes

- Side by side from a `@4xl` container (7 + 5 columns); stacked below.
- With no runner-up, the lead takes the full width.
- Renders `null` with no post.
