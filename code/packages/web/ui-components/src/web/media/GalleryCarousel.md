> `module.gallery` client half · `renderers/GalleryCarousel.tsx`

**Use when** a `module.gallery` block needs its interactive carousel — swipe/drag paging, a thumbnail strip, and a full-screen lightbox. Rendered by the server `<Gallery>` wrapper.

## Props

| Prop     | Type             | Default | Notes                                                        |
| -------- | ---------------- | ------- | ------------------------------------------------------------ |
| `images` | `GalleryImage[]` | —       | Resolved images (`url`, `alt`, `lqip`, `aspectRatio`, …).    |
| `ratio`  | `string`         | `"3:2"` | One of `3:2 · 4:3 · 16:9 · 1:1 · 4:5`; frames the filmstrip. |

## Notes

- Client component (`"use client"`) — two synced embla instances (main viewport + drag-free thumbnails).
- Reads i18n labels from `pages.blog.gallery` and `common` via `useTranslations`; needs a next-intl provider (mocked in Storybook).
- Accessibility: `role="region"` + `aria-roledescription="carousel"`, per-slide labels, keyboard-focusable prev/next arrows, an `aria-live` slide announcer, and a focus-trapped `Dialog` lightbox (Escape closes).
- Carousel frames every image to `ratio` with `object-cover`; the lightbox shows each uncropped at its own size, capped to the viewport.
- A single image drops the carousel chrome (arrows, counter, strip) but keeps click-to-zoom.
- Restraint: active/current states use neutral `foreground`, not the brand accent.
