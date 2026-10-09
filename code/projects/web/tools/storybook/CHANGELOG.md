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

- **The website surface Storybook has stories, in light and dark.** `test:stories:website` found 0
  stories. It now runs 15 colocated story files from the website `src`: the layout chrome
  (`Header`, `Footer`, `Logo`, `LocaleSwitcher`, `ThemeToggle`, `AuthMenu`, …), `NavIcon`,
  `NewsletterConfirm`, the erasure forms, and `FeaturedArticles`. Copy comes from the website's
  `messages/en.json`. The config adds the `storybook/test` resolve, a demo Clerk publishable key
  (the signed-out sign-in link), and a dark project. The `next-intl` mock `Link` now keeps `href`,
  so it renders a real link. Website `tsc` skips `*.stories.tsx` (the website has no Storybook
  types); the story run is their check.
- **The consent UI is in the gallery.** `packages-web-compliance` joins the story sources, so the
  website's `CookiePreferences` dialog renders (through the `next-intl` mock) next to the shared
  `ConsentBanner` and `AccountConsentTab`.

### Fixed

- **The a11y gate now actually runs — in light and dark.** `test:stories` never failed on an axe violation:
  the addon's default `a11y.test` is `"todo"` (warn only), and the vitest setups did not pass the addon's
  annotations, so axe never ran. The preview now sets `a11y: { test: "error" }`, both setups (gallery +
  website surface) pass `@storybook/addon-a11y/preview`, and a second `storybook-dark` project re-runs
  every story with `data-theme="dark"` — contrast differs per theme. 506/506 pass (253 stories × 2 themes)
  after the fixes logged in the packages CHANGELOG. Tests time out at 30 s (two themes double the load).
- **Translated components render in en and fr, from the real messages.** The `next-intl` mock read a
  hand-copied English map that had drifted (French quote marks in English, a dead `playVideo` key). It
  now reads the website's `messages/{en,fr}.json`; a **Locale** toolbar switches them, and a missing key
  logs an error. `QuoteList` gains English + French stories that pin each locale's quote marks.
- **`test:stories:website` passes while the surface has no stories** (`--passWithNoTests`). The CI
  `browser-stories` step failed on main because the website stories live on an unmerged branch.

### Changed

- **Cloudflare observability is fully on.** Traces (10% sampled) and Issues (grouped production
  errors) join the Workers Logs in the top-level `wrangler.toml` `[observability]` block, which every
  env inherits. Wrangler is pinned to 4.143.0 (Issues needs ≥ 4.134). A test fails if a part is off.
- **One sidebar tree.** Dropped the `Native` root, `react-native-web`, the native theme decorator and the
  `Tokens-Native` page; stories lost their `Web/` title prefix. The order stays: Introduction · Design
  Tokens · domain components · UI atoms last. **Why:** React Native is gone from the codebase.

### Added

- **Scripted deploy as a Cloudflare Worker (`deploy:web:storybook:<env>`).** The gallery ships as a
  **Worker serving static assets** (Workers Static Assets — a `wrangler.toml` with `[assets]` and no
  `main`), now a full `apps.mjs` registry peer (`worker-cf`, `kind: tool`, order 60 — so `deploy:all` +
  CI include it). `deploy:storybook:<env>` runs `storybook:build` then the shared `deploy/worker.mjs`
  (`wrangler deploy`), naming the Worker on the shared convention `<prefix>-<env>-web-tools-storybook`.
  Adds a `storybook` row to `domains.mjs` for the prod **subdomain** `storybook.<root>` (a normal Worker
  route, like admin/app/api), a `wrangler` devDep, and the `.vscode/tasks.json` entries. **Why:** the
  design-system gallery is a public reference, named + served + deployed consistently with the other
  workers (Worker, not Pages).

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

- **Sidebar rerooted under `Web` and `Native` umbrellas, ordered domain-first.** Every brick story
  title now nests under one of two roots — `Web/…` (`UI Components` → `Chrome` → `Compliance` →
  `System Pages` → `Icons` → `UI`) or `Native/…` (`System Pages` → `UI`) — so the two renderer families
  are visually separated and each group runs **domain components first, UI atoms last**. Driven by an
  explicit `options.storySort` order in `.storybook/preview.tsx`; docs + `Design Tokens` sit above the
  split. **Why:** the flat, alphabetical roots mixed web and native and buried the composed blocks under
  the primitives; the umbrellas make the gallery navigable at a glance. `test:stories` stays 265/265.
- **Story examples render full-width by default.** Flipped the global preview `layout` from `centered`
  to `fullscreen` (both `.storybook` and `.storybook-website`), so the tiny centered previews now fill
  the column in Docs and Canvas. Stories that need it still opt into `centered`/`padded` per-story.
  **Why:** composed blocks (Hero, Pricing…) were shrunk to content width and hard to read.
- **`test:stories` is now a BLOCKING CI gate.** Split the advisory `browser` job into a blocking
  `browser-stories` (stories = component + a11y tests) and an advisory `browser-e2e` (visual/e2e until
  linux baselines land). **Why:** the stories are the component test suite; failures should fail CI.

### Fixed

- **`test:stories` discovered ZERO tests.** `brickStories()` emitted an **absolute** glob; the
  `storybook build` normalizer tolerated it, but the addon-vitest plugin mis-joined it and found no
  tests — silently, because the CI job was `continue-on-error`. Emit a **configDir-relative** glob so
  both the gallery and the test runner discover every story. **Why:** the whole story-test gate was a
  no-op; this is the real "story tests aren't automated" cause.
