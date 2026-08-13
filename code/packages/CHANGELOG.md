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

- **`@indiecrafts/sanity/write` — server-only authenticated write client.** New `./write`
  export: `writeClient` (Editor-role `SANITY_API_WRITE_TOKEN`, `import "server-only"`). The one
  runtime write path (blog comments today); callers hard-code `_type` + whitelist fields so no
  untrusted input is spread into a mutation.

### Changed

- **`FeaturedMedia` gained `autoplay` + `controls`.** `autoplay` mounts the player
  immediately, muted + looping (ambient backdrop, no play button); `controls` toggles the
  native/provider player UI (embeds get `mute=1`/`controls=0` url params per provider).
  Defaults preserve the click-to-play facade with controls on.
- **`FeaturedMedia` replaces `VideoEmbed` + `PlayBadge`** in `@indiecrafts/ui-components` —
  **one structure for a featured image or video**. The video plays **inline** (poster swaps
  to an `<iframe>`/`<video>` in place on click, facade/lazy-mount) — **no dialog**. Handles
  the image (CDN-sized, lqip blur), the play button, and the badge-only marker
  (`interactive={false}`). i18n-agnostic (`playLabel` prop). Used by the post hero, blog
  frontpage, and all cards, so image and video render identically everywhere.

### Added

- **Dailymotion featured-video support** in `@indiecrafts/utils` `parseVideoEmbed` — accepts
  `dailymotion.com/video/<id>`, `/embed/video/<id>`, and short `dai.ly/<id>` (strips a
  `_title` suffix; id `^[a-zA-Z0-9]{5,32}$`), producing `dailymotion.com/embed/video/<id>`.
  Joins YouTube/Vimeo/file. Host must be in the app's `frame-src` CSP (done).
- **`VideoEmbed` + `PlayBadge` extracted to `@indiecrafts/ui-components`** (`renderers/`)
  from the blog module, so app pages + blog share one video player + badge. `VideoEmbed`
  (was blog `HeroVideo`) and `PlayBadge` are i18n-agnostic — labels are passed in, not
  self-resolved — so the package owns no message namespace. Enables the page-builder
  `embed`/`hero` media block without duplicating the player.

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
