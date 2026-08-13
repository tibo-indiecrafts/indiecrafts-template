# Images — Sanity CDN optimisation

Every image on the site is sized **at the CDN** before it reaches the browser. You don't
call an image builder or hand-write URLs — render with `next/image` and it happens.

## How it works

`next/image` never fetches the full-resolution original. A loader
(`@indiecrafts/sanity/image`, wired via `images.loaderFile` in `next.config.ts`) rewrites
each request to a CDN-sized source:

```
https://cdn.sanity.io/images/…/cover-2400x1600.jpg
  ?w=768          resize to the candidate width next/image asked for
  &q=75           compression quality
  &auto=format    serve webp/avif by the browser's Accept header
  &fit=max        scale down only — never upscale past the original
```

Sanity's (and Unsplash's, for demo content) image CDN resizes and re-encodes at the edge.
Because the loader runs per `srcset` candidate, each viewport downloads only the width it
needs. There is **no** double-fetch through Next's own optimizer, and no `/_next/image`
proxy — the CDN is the optimizer.

The loader only touches the resize-capable hosts (`cdn.sanity.io`, `images.unsplash.com`).
Local assets (`/logo.svg`, `/brand/*`), data URIs, and **SVGs** pass through untouched — a
`?w=` on an SVG would make Sanity rasterize it to PNG and lose the vectors.

## Using it

- Render Sanity/remote images with `next/image`. That's the whole story — the loader sizes
  them.
- **Always pass `sizes`** (or `width`/`height`). The loader builds `srcset` from the widths
  `next/image` derives from `sizes`; a `fill` image with no `sizes` ships one giant
  `100vw` candidate.
- **Blur-up:** when the GROQ fragment carries `metadata.lqip`, pass `placeholder="blur"` +
  `blurDataURL={lqip}`. Fetch `asset->{ url, metadata }` and set
  `options: { metadata: ["lqip"] }` on the image schema field. The gallery grid already
  does this; extending it to every block is tracked but optional.
- **Raw `<img>`:** the loader only rewrites `next/image`. The one deliberate raw `<img>`
  (gallery full-view) appends `?w=1600&auto=format&fit=max&q=80` itself — do the same if a
  raw `<img>` is ever unavoidable.
- **`unoptimized` images** (the logo — kept unoptimized so editor-uploaded SVGs stay
  vector) still get sized when raster: they call `sanityImageLoader(...)` to build the src,
  and the SVG guard leaves vectors alone.

## Adding a resize-capable host

If a new external image host resizes by query string, add it to `SIZED_HOSTS` in
`code/packages/sanity/src/image.ts` and to `images.remotePatterns` in `next.config.ts`.

## Rule + code

- Loader: [`@indiecrafts/sanity/image`](/packages/sanity) · shim:
  `code/apps/web/src/lib/sanity-image-loader.ts`.
- Blog gallery lqip detail: [gallery](/modules/blog/gallery).
