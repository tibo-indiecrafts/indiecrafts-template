# Changelog — modules (`@indiecrafts/*` product slices)

One record for the product modules under `code/modules/`. Every change that adds, extracts,
or reshapes a module's public surface or wiring lands here in plain language with the _why_.
Rolls up to the [root `CHANGELOG.md`](../../CHANGELOG.md) at release.

**Not here:** app behavior/routes/tokens → [`code/apps/web/CHANGELOG.md`](../apps/web/CHANGELOG.md);
shared bricks → [`code/packages/CHANGELOG.md`](../packages/CHANGELOG.md); docs-site →
[`docs/CHANGELOG.md`](../../docs/CHANGELOG.md); method → [`method/CHANGELOG.md`](../../method/CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com). Categories: **Added ·
Changed · Deprecated · Removed · Fixed**.

## [Unreleased]

### Changed

- **A post can have several authors.** The post `author` (single reference) became **`authors`**
  (an ordered array, min 1; first = lead). Bylines updated everywhere: the post hero lists
  **all** authors (avatar + name + role, each linked), cards show the **first + "+N"**, and the
  `blog-post-content` byline joins names via `Intl.ListFormat` ("A and B"). A post now appears
  on **each** of its authors' `/author/<slug>` pages (`postsByAuthor` matches the array;
  `postCount` already used field-agnostic `references()`). The seed co-writes the featured post
  (Ada + Grace). _Migration:_ existing single-`author` posts need `author` → `authors[0]`
  (the seed rewrites demo data; real datasets need a one-off patch).

### Added

- **Editors can upload their own featured video + toggle autoplay/controls.** Post
  `metadata` gained `videoFile` (uploaded `.mp4`/`.webm`, wins over the `videoUrl` embed
  link), `videoAutoplay` (muted + looping ambient backdrop, hero only), and `videoControls`
  (default true). GROQ resolves one source — `"video": coalesce(videoFile.asset->url,
  videoUrl)` — so uploads and links share the same `parseVideoEmbed` path. The seed sets a
  demo YouTube URL on the featured post so a video is visible out of the box.

### Changed

- **Blog media + cards simplified.** The post hero is now **one structure for image and
  video** — a media block (image, or inline-playable video via `FeaturedMedia`) with title +
  meta below in theme colours; dropped the white-on-dark image overlay + all `--hero-*` CSS
  vars + the dual code path + the separate below-the-fold video block. `BlogCard` distilled
  (dropped the avatar-spill overlay + tags row; calmer hover) and the `/blog` frontpage
  mosaic distilled (dropped the avatar overlay, added a video marker). Video now plays inline
  in cards + hero — no modal.
- **Blog featured video accepts Dailymotion + player extracted.** `metadata.videoUrl` now
  takes Dailymotion / `dai.ly` URLs (Studio legend updated). The video player moved out of
  the blog (`post/components/HeroVideo` → `@indiecrafts/ui-components` `renderers/VideoEmbed`)
  and the listing play-badge too (`shared/components/PlayBadge` → same package), so app pages
  and the blog share one player; `BlogCard` passes the badge `label` from `pages.blog`.

### Added

- **`@indiecrafts/blog` — the blog extracted to a module.** The blog feature moved from the
  app (`src/features/blog`) to `code/modules/blog/` as a self-contained, feature-flagged
  vertical slice, consumed by the app as source. Wired via `transpilePackages`, a tsconfig
  `paths` entry (`@indiecrafts/blog/*`, mixed `.ts`/`.tsx`), a `@source` line in
  `ui-tokens/globals.css`, and schema/structure registration in `sanity.config.ts`. It
  depends on the shared bricks (`config`/`utils`/`sanity`/`ui`/`ui-components`/`i18n`) and
  never on the app. See [`docs/modules/blog/`](../../docs/modules/blog/).
