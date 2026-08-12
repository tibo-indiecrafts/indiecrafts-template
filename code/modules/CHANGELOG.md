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
