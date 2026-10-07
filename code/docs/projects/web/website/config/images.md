---
title: "Images — Sanity CDN optimisation"
description: "Every image on the site is sized at the CDN before it reaches the browser."
status: stable
---

# Images — Sanity CDN optimisation

Every image on the site is sized **at the CDN** before it reaches the browser. You don't
call an image builder or hand-write URLs — render with `next/image` and it happens.

## How it works

`next/image` never fetches the full-resolution original. A loader
(`@indiecrafts/packages-web-sanity/image`, wired via `images.loaderFile` in `next.config.ts`) rewrites
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
`code/packages/web/sanity/src/image.ts` and to `images.remotePatterns` in `next.config.ts`.

## Serving your own assets from a CDN (per env, per app)

Two different CDNs, kept **separate**:

- **Sanity content** (images, uploaded video) — served + optimised by **Sanity's own CDN**
  (`cdn.sanity.io`) via the loader above. Global, cached, zero-config, and **shared by nature** (one
  dataset per tenant). This never changes.
- **The app's own build assets** (`/_next/*` JS/CSS/fonts + first-party `/public` files) — served
  from the **origin** by default. To put them on a CDN, set **`NEXT_PUBLIC_CDN_URL`** → it feeds
  `site.cdnUrl` → Next **`assetPrefix`** (`next.config.ts`), so every `/_next/*` URL is prefixed with
  the CDN host. **Sanity content is not affected** — it keeps `cdn.sanity.io`.

### Per env, addable to any app

`NEXT_PUBLIC_CDN_URL` is a **build-time** value, and each environment deploys its own build
(`deploy:<app>:<env>` runs `build:cf` per env). So a per-env CDN is just a per-env value:

- **CI (real deploys):** set `NEXT_PUBLIC_CDN_URL` in each **GitHub Environment** (dev / staging /
  prod) — the workflows already pass `vars.NEXT_PUBLIC_CDN_URL` into the build.
- **Local:** `.env.local` (for `next dev`) or the commented `[env.*.vars]` in `wrangler.toml`.
- **Empty = off** — assets serve from the origin (the default).

Any app opts in the same way — a shared config primitive (`site.cdnUrl`) + one `assetPrefix` line. So
the **mechanism is shared**; the **value is per-app × per-env**.

### Provisioning the CDN

- **External CDN** (Bunny, Fastly, CloudFront…) in front of the origin — no infra here; just point
  `NEXT_PUBLIC_CDN_URL` at it.
- **Cloudflare** — a `cdn.<domain>` custom domain + a `/_next/static/` immutable cache rule: the
  commented `cloudflare_workers_custom_domain "cdn"` block in `code/projects/web/surfaces/website/infra/main.tf` (per
  env via tfvars).
- **First-party image transforms** (NOT Sanity content) — to serve non-Sanity images from your own
  domain, enable Cloudflare **Image Transformations** (the commented `image_resizing` zone setting in
  `infra/main.tf`) + a `/cdn-cgi/image/width=…,quality=…,format=auto/<src>` loader. Sanity content
  doesn't need this — its CDN already optimises.

## Rule + code

- Loader: [`@indiecrafts/packages-web-sanity/image`](/packages/web/sanity) · shim:
  `code/projects/web/surfaces/website/src/lib/sanity-image-loader.ts`.
- Asset CDN: `site.cdnUrl` (`@indiecrafts/packages-shared-config`) → `assetPrefix` (`next.config.ts`); env `NEXT_PUBLIC_CDN_URL`.
- Blog gallery lqip detail: [gallery](/modules/web/blog/gallery).

## The LCP image

Mark the page's one largest image (a post or blog hero) with `loading="eager"` + `fetchPriority="high"` —
`FeaturedMedia`'s `priority` prop does exactly that. Next 16 deprecated `<Image priority>`: it now only
preloads, at default priority, so on a slow mobile link the hero queued behind ~300 kB of scripts and
fonts. Give high priority to one image per page (the blog mosaic's first card, not both large ones);
everything else stays lazy.
