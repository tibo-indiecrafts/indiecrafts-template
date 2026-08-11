# Image gallery module

**Schema `_type`:** `module.gallery` · **Studio label:** « Galerie d'images » · **Renderer:** `GalleryCarousel` (client) behind the server `Gallery` wrapper.

A swipeable image carousel for post bodies: a thumbnail strip, an image counter, and click-to-zoom fullscreen. It's one of the inline blocks in the body editor's **+** picker, and it also works in the `blog.postModules` layout slot.

## What the reader gets

- **A carousel** — one image at a time in a fixed frame, swipe/drag on touch, prev/next arrows on larger screens (always visible so the gallery reads as swipeable; the backdrop deepens on hover).
- **A thumbnail strip** below it — click any thumbnail to jump; the active one is ring-highlighted (neutral `foreground`) and scrolls itself into view.
- **A counter** — an editorial `03 / 12` badge (top-right), current index emphasised, total muted.
- **Click-to-zoom** — clicking the main image opens a full-screen lightbox where every image is shown **in full** (uncropped), with its own arrows, counter and an Escape-to-close.
- **Responsive + accessible** — adapts from phone to desktop, has a blurred `lqip` placeholder while each image loads, per-image alt text, keyboard-operable arrows/thumbnails, and a screen-reader announcement on slide change.

Restraint (see `DESIGN.md`): the gallery is quiet chrome, so active/current states use the neutral `foreground`, **not** the `brand` accent.

## Add one (editor)

1. In a post body, click **+** on an empty line → **Galerie d'images** (or add it to the blog **Mise en page** singleton's `postModules`).
2. Fill the fields:

| Field                 | Purpose                                                                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Titre** (optional)  | A small heading above the gallery.                                                                                                                                  |
| **Intro** (optional)  | A line of context under the title.                                                                                                                                  |
| **Format des images** | The frame every image is shown in inside the carousel: **3:2** (default), 4:3, 16:9, 1:1, or 4:5. Fullscreen ignores this and shows each image whole.               |
| **Images**            | Drag to reorder — the carousel and thumbnails follow this order. Each image takes an optional **Texte alternatif** (accessibility). At least one image is required. |

3. Publish. That's it — no width/height or layout to set.

::: tip Cropping vs. full view
Inside the carousel, images are cropped to fill the chosen **Format** so the filmstrip stays even. A visitor who wants the whole image just clicks it — the fullscreen view never crops. Pick a **Format** close to how your photos are shot to minimise cropping (portrait sets → 4:5, landscape → 3:2 or 16:9).
:::

## How it's wired (developer)

Standard page-builder module (see [blog-architecture](./blog-architecture.md) for the general shape; the full add/remove checklist is `.claude/workflows/add-blog-module.md`). The gallery-specific pieces:

- **Schema** — `sanity/schema/modules/gallery.ts`. Registered in `modules/index.ts` (`moduleSchemas` + `MODULE_TYPES`), the body picker (`blockContent.ts` `INLINE_MODULES`) and `portable-text-components.tsx` `INLINE_TYPES`.
- **Query** — `MODULES_FRAGMENT` (`queries.ts`) projects each image to `{ url, alt, lqip, aspectRatio, width, height }` via `asset->`. The `lqip` drives the blur placeholder.
- **Types** — `GalleryModule` / `GalleryImage` in `sanity/types.ts`, added to `AnyModule`.
- **Renderers** — `renderers/Gallery.tsx` is the **server** wrapper (owns spacing + the optional title/intro; the registry calls module renderers as functions, which only works for server components). It renders the **client** `renderers/GalleryCarousel.tsx`, which holds the two synced [embla](https://www.embla-carousel.com/) instances (main + thumbnails) and the lightbox (a `Dialog` + the shared `ui/embla-carousel` `Carousel`). Registered in `registry.tsx` `SIMPLE_MODULES`.
- **Dependency** — `embla-carousel-react` (also backs `ui/carousel.tsx` / `ui/embla-carousel.tsx`).
- **Strings** — `pages.blog.gallery.*` in `messages/<locale>.json` (region label, image label, open/close, go-to-image); arrow labels reuse `common.previous` / `common.next`.

To change the default frame, edit `RATIO_CLASS` (in `GalleryCarousel.tsx`) + the schema's `ratio` list. To add a ratio, add it in both places and to the `GalleryModule["ratio"]` union.

> Not seeded: the demo seed (`pnpm seed`) doesn't create a gallery — it needs uploaded images. Add one by hand in the Studio to see it.
