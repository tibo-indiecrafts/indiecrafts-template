# `@indiecrafts/config` — shared config primitives + page contract

The shared config **primitives** (URL/prefix, locales, Intl format defaults, env/CSP, logging)
plus the generic **page-config contract** and shared types. **App-instance config** — `theme`,
`fonts`, `features`, and the `pages` map — is **app-owned** (`code/projects/web/surfaces/website/src/config`, imported via
`@/config`) so a second app ships its own; see [Multi-app](/shared/architecture/multi-app). Still —
**never hard-code a brand string, URL, color, or nav entry**; read from `@/config`.

|               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exports**   | **Split by portability into scope subpaths.** `./shared` — platform-agnostic core: `i18n` (locales + `localePrefix`/`localizedPathname`/`isLocale`) · `format` (`formatDefaults`/`localeFormat`) · `types` (pure TS, no `next`/DOM/env). `./web` — web-only: `site` (url · prefix · logging) · `env` (`getCurrentEnvironment`/`getCSPConnectSources` · CSP) · `seo` (`seoDefaults` — crawl mechanics) · `pages` (the generic contract — `PageConfig`/`PageSeo`/`isPageVisible`, **not** any app's route map). `./mobile` · `./hybrid` — reserved, re-export `./shared` today. The root **`.` barrel = `shared` + `web`** (the web surface), so web apps keep `import { … } from "@indiecrafts/config"`; mobile/hybrid import `@indiecrafts/config/mobile` to skip the web slice. |
| **Deps**      | none — **zero `next` coupling** (the `Robots` type is a local mirror in `web/pages.ts`), so services + mobile/hybrid consume it freely.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Consumers** | packages + modules import the primitives directly (`utils`, `sanity`, `i18n`, `format`, `logger`, `security`, `consent`, `email`, `blog`, …); the **app** imports `@/config`, which re-exports these primitives beside its own `theme`/`fonts`/`features`/`pages`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

- **Gotcha — brand/SEO copy is Sanity, not config.** Only `site.url`
  (`NEXT_PUBLIC_SITE_URL`, else the `https://example.com` placeholder) stays in code;
  name/tagline/description/JSON-LD moved to Sanity singletons. The app's `pages` map
  (`code/projects/web/surfaces/website/src/config/pages.ts`, conforming to this package's `PageConfig`) is structural
  routing only (`key`/`id`/`slug`/`enabled`) — per-page SEO lives in Sanity on each
  rendering document's `.seo` (the shared `seoMeta`).
- **Gotcha — app-instance config is app-owned.** `theme`/`fonts`/`features`/`pages` live in
  `code/projects/web/surfaces/website/src/config`, not here — so a second app ships its own. Modules/packages that need
  a feature flag receive it injected (the blog reads `configureBlog`; newsletter/waitlist take
  `xSanity(enabled)`; consent takes `getLegalAcceptance(locale, flags)`) rather than importing
  a central registry. See [Multi-app](/shared/architecture/multi-app).
- **Gotcha — `PageSeo.*Key` fields are plain `string`**, not a message-key type: the
  coupling to the app's message keys was cut on extraction so config stays app-agnostic.
- **Locale rows carry formatting rules.** Each `i18n.locales` row holds `numberLocale` ·
  `currency` · `capitalizeInlineNouns` · `adjBeforeNoun`; `formatDefaults` fills any row that
  omits them, and `localeFormat(locale)` resolves the merged set. Consumed by
  [`@indiecrafts/format`](./format) — config owns the DATA, the brick owns the Intl logic.
- **`logging` — per-env log config (read by [`@indiecrafts/logger`](./logger)).** `levels`
  (`production: "silent"` = prod console off) + `redactKeys`. DATA only; the resolution +
  `NEXT_PUBLIC_LOG_LEVEL` override live in the logger brick.
- **`DEFAULT_SITE_PREFIX` / `site.prefix` — the per-deployment namespace.** `site.prefix` reads
  `NEXT_PUBLIC_SITE_PREFIX`, else the `DEFAULT_SITE_PREFIX` constant. It prefixes the browser-owned
  keys — the consent record, the theme choice, and the locale cookie (`localeCookieName`) — so two
  template instances never collide even on a shared origin. Keep it in sync with the `wrangler.toml`
  deploy names via `pnpm project:rename <slug>`; **must be unique per client**. See
  [New client](/apps/web/setup/new-client) + [Deployment](/apps/web/setup/deployment).

## Wiring & conventions

How every brick is consumed (exports · `transpilePackages` · resolution · Tailwind `@source`
· hardening), the ≥2-consumer rule → **[Packages overview](./)**.

- [`code/packages/shared/config/`](../../code/packages/shared/config/) — the source
- [`code/packages/_registry.md`](../../code/packages/_registry.md) — roster + rule
