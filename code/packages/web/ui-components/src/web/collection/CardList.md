> `module.card-list` · `code/packages/web/ui-components/src/web/collection/CardList.tsx`

**Use when** you want a responsive grid of small cards — each an image, title, short body, and optional link. Good for feature lists, category tiles, or a "why us" row.

## Fields

| Field     | Type           | Notes                                                         |
| --------- | -------------- | ------------------------------------------------------------- |
| `columns` | `number` (1–4) | Optional; most columns, from a wide container. Default `3`.   |
| `cards[]` | array          | Each: `title`, `content` (PortableText), `image`, `cta`.      |
| `title`   | `string`       | Optional; schema field, not rendered by the current renderer. |
| `intro`   | `string`       | Optional; schema field, not rendered by the current renderer. |
| `anchor`  | `string`       | Optional; element `id`.                                       |

## Notes

- Server component. Pass `components={portableComponents}` — each card body is PortableText.
- Renders nothing when `cards` is empty.
- Images use `next/image` with `fill` in a fixed `4:3` frame (`object-cover`); a card without an image drops the media.
- Cards sit on a hairline grid (shared 1px dividers) inside a rounded surface.
- Built on `ModuleSection`: a page section with gutters, or bare when `inline` (rich text, a sidebar card). Columns and padding follow the block's own width (`@container`), never the viewport.
