---
title: "Image gallery module"
description: "Schema type: module.gallery · Studio label: « Galerie d'images » · Renderer: client GalleryCarousel behind the server Gallery wrapper."
status: stable
---

# Image gallery module

**Schema `_type`:** `module.gallery` · **Studio label:** « Galerie d'images » · **Renderer:** client `GalleryCarousel` behind the server `Gallery` wrapper.

A swipeable image carousel for post bodies — a thumbnail strip, an image counter, and click-to-zoom fullscreen. One of the 9 inline blocks in the body editor's **+** picker, and it also works in the `blog.postModules` layout slot.

## What the reader gets

- **A carousel** — one image at a time in a fixed frame; swipe/drag on touch, always-visible prev/next arrows on larger screens (the backdrop deepens on hover). The carousel loops.
- **A thumbnail strip** below it — click a thumbnail to jump; the active one is ring-highlighted (neutral `foreground`) and scrolls itself into view.
- **A counter** — an editorial `03 / 12` badge, top-right, current index emphasised, total muted.
- **Click-to-zoom** — clicking the main image opens a full-screen lightbox (`Dialog`) where each image is shown **whole** (uncropped, `object-contain`), with its own arrows, and Escape to close.
- **Responsive + accessible** — a blurred `lqip` placeholder while each image loads, per-image alt text, keyboard-operable arrows/thumbnails, and an `aria-live` announcement on slide change. A single-image gallery drops the carousel chrome but keeps zoom.

Restraint (see `code/packages/shared/ui-tokens/DESIGN.md`): the gallery is quiet chrome, so active/current states use the neutral `foreground`, **not** the `brand` accent.

## Add one (editor)

1. In a post body, click **+** on an empty line → **Galerie d'images** (or add it to the blog **Mise en page** singleton's `postModules`).
2. Fill the fields:

| Field                 | Purpose                                                                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Titre** (optional)  | A small heading above the gallery. Wrap a word in `[[ ]]` to colour it in the brand accent — e.g. `Nos [[derniers]] projets`.                             |
| **Intro** (optional)  | A line of context under the title.                                                                                                                        |
| **Format des images** | The frame every image sits in inside the carousel: **3:2** (default), 4:3, 16:9, 1:1, or 4:5. Fullscreen ignores this and shows each image whole.         |
| **Images**            | Drag to reorder — carousel and thumbnails follow this order. Each takes an optional **Texte alternatif**. At least one image is required (`Rule.min(1)`). |

3. Publish. No width/height or layout to set.

::: tip Cropping vs. full view
Inside the carousel, images are cropped (`object-cover`) to fill the chosen **Format** so the filmstrip stays even. A visitor who wants the whole image just clicks it — the fullscreen view never crops. Pick a **Format** close to how your photos are shot to minimise cropping (portrait sets → 4:5, landscape → 3:2 or 16:9).
:::

## How it's wired (developer)

A standard page-builder module (general shape + full add/remove checklist in [blog-architecture](/modules/web/blog/blog-architecture#8-adding-removing-a-module)). The gallery-specific pieces:

- **Schema** — `sanity/schema/modules/gallery.ts` (via `defineModule`, `ImagesIcon`). Registered in `modules/index.ts` (`moduleSchemas` + `MODULE_TYPES`), the inline allowlist (`blockContent.ts` `INLINE_MODULES`) and `portable-text-components.tsx` `INLINE_TYPES`.
- **Query** — `MODULES_FRAGMENT` (`queries.ts`) projects each image via `asset->` to `{ _key, url, alt, lqip, aspectRatio, width, height }`. The `lqip` drives the blur placeholder.
- **Types** — `GalleryModule` / `GalleryImage` in `sanity/types.ts`, added to `AnyModule`.
- **Renderers** (`@indiecrafts/packages-web-ui-components/web/media/`) — `Gallery.tsx` is the **server** wrapper (owns spacing via `not-prose my-5 md:my-10` + the optional title/intro; the registry invokes module renderers as plain functions, which only works server-side). It renders the **client** `GalleryCarousel.tsx`, which holds two synced [embla](https://www.embla-carousel.com/) instances (main + drag-free thumbnails) and the lightbox (a `Dialog` + the shared `@indiecrafts/packages-web-ui/web/embla-carousel` `Carousel`). Registered in `web/registry.tsx` `BLOCK_RENDERERS` (gallery is a generic block; schema in `@indiecrafts/packages-web-page-builder`).
- **Dependency** — `embla-carousel-react` (also backs the shared `@indiecrafts/packages-web-ui` carousel).
- **Strings** — `pages.blog.gallery.*` in `messages/<locale>.json` (`regionLabel`, `imageLabel`, `open`, `close`, `goToImage`); arrow labels reuse `common.previous` / `common.next`.

To change the default frame, edit `RATIO_CLASS` (in `GalleryCarousel.tsx`) **and** the schema's `ratio` list. To add a ratio, add it in both places **and** to the `GalleryModule["ratio"]` union in `sanity/types.ts`.

> **Not seeded:** `pnpm seed` doesn't create a gallery — it needs uploaded images. Add one by hand in the Studio to see it.
