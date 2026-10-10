> `module.gallery` · `code/packages/web/ui-components/src/web/media/Gallery.tsx`

**Use when** you want a responsive image grid that opens a full-screen lightbox carousel — a portfolio strip, a set of photos, a product gallery.

## Fields

| Field      | Type                               | Notes                                                                |
| ---------- | ---------------------------------- | -------------------------------------------------------------------- |
| `images[]` | array                              | Each: `url`, `alt`, `lqip` (blur), `aspectRatio`, `width`, `height`. |
| `ratio`    | `3:2 \| 4:3 \| 16:9 \| 1:1 \| 4:5` | Optional; the crop the thumbnails are framed to.                     |
| `title`    | `string`                           | Optional; heading above the grid.                                    |
| `intro`    | `string`                           | Optional; supporting line under the title.                           |
| `anchor`   | `string`                           | Optional; element `id`.                                              |

## Notes

- This file is the **server** half: it renders the optional `title`/`intro` and spacing, then hands the images to the client `<GalleryCarousel>` (embla can't run on the server). No `components` prop.
- Images without a `url` are filtered out; the block renders nothing when none remain.
- Thumbnails are framed to `ratio` with `object-cover`; the lightbox shows each image uncropped. The lightbox is a focus-trapped dialog with keyboard arrows and Escape-to-close.
- Built on `ModuleSection`: page gutters as a section, bare (`not-prose`) when `inline`.
