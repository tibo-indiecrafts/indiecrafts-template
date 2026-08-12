# Changelog — packages (`@indiecrafts/*` bricks)

One record for the shared bricks under `code/packages/`. Every change that adds,
splits, or reshapes a brick's public surface lands here in plain language with the
_why_. Rolls up to the [root `CHANGELOG.md`](../../CHANGELOG.md) at release.

**Not here:** app behavior/routes/tokens → [`code/apps/web/CHANGELOG.md`](../apps/web/CHANGELOG.md);
docs-site → [`docs/CHANGELOG.md`](../../docs/CHANGELOG.md); method → [`method/CHANGELOG.md`](../../method/CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com). Categories: **Added ·
Changed · Deprecated · Removed · Fixed**.

## [Unreleased]

### Added

- **`@indiecrafts/sanity/image` — the `next/image` CDN loader.** New subpath export
  `sanityImageLoader`: an isomorphic loader that appends `?w=&q=&auto=format&fit=max` for
  `cdn.sanity.io` + `images.unsplash.com` (SVG + non-CDN sources pass through). Wired
  app-side via `images.loaderFile`. Behavior/usage logged in the app changelog.
- **`@indiecrafts/ui-components` — shared page-builder blocks.** Extracted the 10 generic
  block renderers **down** out of `@indiecrafts/blog` so the app and the blog render the same
  components and look identical (no duplication → no drift). Ships `BLOCK_RENDERERS` (a
  composable `_type`→component map + `renderBlock`), the shared `portable-text-components`
  map, `ModuleSection` · `Cta`, and the block `types` (`BlockModule` union). The blog's
  `ModuleRenderer` now spreads `BLOCK_RENDERERS` and adds its 3 blog-specific dispatchers
  (`blog-index · blog-post-list · blog-post-content`); `AnyModule = BlockModule | BlogModule`.
  **Renderers moved, schemas didn't** — the block `module.*` schemas stay in the blog for now
  (`person-list`/`quote-list` schemas ref blog `person`/`quote` docs), a later phase moves the
  schemas + a `blockContent` factory. Blog renders byte-identically; build green.
