# Sanity image rules

Load when rendering any Sanity- or Unsplash-hosted image.

**The one home for sizing** — a `next/image` loader (`@indiecrafts/sanity/image`,
wired via `images.loaderFile` in `next.config`) rewrites every `next/image` `src` to a
CDN-sized source (`?w=&q=&auto=format&fit=max`). Sanity + Unsplash resize + re-encode at
the edge; no full-res original is ever downloaded. You get this for free — just render
with `next/image`.

**Rules**

- Render Sanity images with `next/image` — **never** a raw `<img src={asset.url}>` (that
  ships the full-resolution original, un-sized, un-lazy). The one deliberate `<img>`
  (gallery full-view) hard-codes `?w=…&auto=format&fit=max&q=` itself; if you must use a
  raw `<img>`, do the same.
- **Always pass `sizes`** (or `width`/`height`) — the loader needs it to build `srcset`.
  A `fill` image with no `sizes` emits one giant `100vw` candidate.
- Prefer `placeholder="blur"` + `blurDataURL={lqip}` when the GROQ fragment carries
  `metadata.lqip`. Fetch it as `asset->{ url, metadata }` and enable
  `options.metadata: ["lqip"]` on the image schema field.
- Never hand-build Sanity CDN URLs ad hoc in components — the loader owns the params. New
  hosts that resize by query string go in `SIZED_HOSTS` in `@indiecrafts/sanity/image`.

**Verify** — after adding an image, check the Network panel: requests carry
`?w=…&auto=format` and transfer the **downscaled** bytes, not the original; `srcset` is
present. Full guide: `docs/apps/web/config/images.md`.
