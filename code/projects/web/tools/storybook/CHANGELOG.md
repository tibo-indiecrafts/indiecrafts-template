# Changelog — storybook (`@indiecrafts/web-tools-storybook`)

One record for the component gallery (the design-system Storybook) — every change to the
stories, config, or the gallery's conventions lands here in plain language with the _why_.

**Not here:** the design-system bricks it documents → [`code/packages/CHANGELOG.md`](../../../../packages/CHANGELOG.md);
docs-site → [`code/docs/CHANGELOG.md`](../../../../docs/CHANGELOG.md); the repo-wide roll-up →
[root `CHANGELOG.md`](../../../../../CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com). Categories:
**Added · Changed · Deprecated · Removed · Fixed**.

## [Unreleased]

_The Storybook gallery for the design-system bricks (`ui` · `ui-components` · `ui-tokens` +
`announcement`/`locale-suggest` stories). Log new stories, addon/config changes, and the
`test:stories` gate here._

### Added

- **Scripted deploy to Cloudflare Pages (`deploy:web:storybook:<env>`).** The gallery now ships to a
  Pages project named on the shared convention — `<prefix>-<env>-web-tools-storybook` — via the new
  `shared/scripts/deploy/pages.mjs` runner (`storybook:build` → `wrangler pages deploy`, prod-confirmed).
  Adds a `storybook` row to `domains.mjs` for the prod **subdomain** `storybook.<root>` (attached to the
  Pages project by DNS `CNAME` / dashboard, since Pages custom domains aren't wrangler routes), plus a
  `wrangler` devDep and the `.vscode/tasks.json` entries. **Why:** the design-system gallery is a public
  reference for the template, named + served consistently with the other surfaces.

- **Stories for the blog's five new frontpage primitives.** `PostHero`, `FeaturedPosts`,
  `SpotlightRow`, `Carousel`, and `TopicCards` (`@indiecrafts/packages-web-ui-components/web/{layout,collection}`)
  each ship a colocated `.stories.tsx`, auto-discovered by the gallery. **Why:** every rendered
  `ui-components` component needs a story (this package's own rule) — the blog's new composable
  `/blog` frontpage blocks (`code/modules/CHANGELOG.md`) added five.
- **React Native in the gallery.** `.storybook/main.ts` aliases `react-native` →
  `react-native-web` (resolved from this package) and globs the native/cross-platform bricks, so
  `ui-native`, `system-pages/native`, and `ui-icons/native` render in the browser gallery beside the
  web bricks. `preview.tsx` bridges the theme toolbar to the native design system (`ThemeProvider` +
  `Appearance.setColorScheme`). **Why:** one gallery documents web, hybrid (= web), and native.
- **Native token page** (`stories/Tokens-Native.mdx`) — the resolved hex palette from
  `@indiecrafts/packages-shared-ui-tokens/native`, light + dark, linked to the one `tokens.json` source.

> `@debt TESTING` — **native `ui-icons` stories are deferred.** They pull `lucide-react-native`
> + `react-native-svg`, and `react-native-svg` fails to bundle under the Vite/rollup web toolchain
> (a parse error over its untranspiled source). The **web** `ui-icons` renderers are storied; native
> icons need a react-native-svg web shim/alias before they can join. Not a silent gap — tracked here.

### Added (surface composition)

- **Surface Storybooks via composition (refs).** Surface components use each app's `@/`
  alias (a *different* src root per app), so one Vite config can't resolve all of them. Each
  surface gets its own config that runs with that app's `@/` — `.storybook-website/` +
  `vitest.website.config.ts` + `storybook:website` / `test:stories:website` scripts, composed
  into the main gallery via env-gated `refs` (`STORYBOOK_COMPOSE=1`). First stories: website
  `SkipLink`, `NavIcon`. `test:stories:website` joins the blocking `browser-stories` CI job.
  **Why:** documents surface (app-wiring) components alongside the design-system bricks without
  the cross-app `@/` collision. App · mobile · hybrid follow the identical template.

### Changed

- **`test:stories` is now a BLOCKING CI gate.** Split the advisory `browser` job into a blocking
  `browser-stories` (stories = component + a11y tests) and an advisory `browser-e2e` (visual/e2e until
  linux baselines land). **Why:** the stories are the component test suite; failures should fail CI.

### Fixed

- **`test:stories` discovered ZERO tests.** `brickStories()` emitted an **absolute** glob; the
  `storybook build` normalizer tolerated it, but the addon-vitest plugin mis-joined it and found no
  tests — silently, because the CI job was `continue-on-error`. Emit a **configDir-relative** glob so
  both the gallery and the test runner discover every story. **Why:** the whole story-test gate was a
  no-op; this is the real "story tests aren't automated" cause.
