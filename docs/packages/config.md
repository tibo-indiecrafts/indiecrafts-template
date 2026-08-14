# `@indiecrafts/config` — site config data + shape

The single source of site DATA (URL, locales, feature flags, theme, fonts, `pages` map)
plus its types and runtime helpers. Everything else reads from here — **never hard-code a
brand string, URL, color, or nav entry**.

| | |
| --- | --- |
| **Exports** | **One `.` barrel** (`src/index.ts`) — the single import surface (`import { … } from "@indiecrafts/config"`). Composed from per-concern internal modules: `site` (url · prefix · logging) · `theme` · `i18n` (locales + `localePrefix`/`localizedPathname`/`isLocale`) · `format` (`formatDefaults`/`localeFormat`) · `features` · `seo` (`seoDefaults` — crawl mechanics only) · `pages` (map + `isPageVisible` + `PageConfig`/`StaticAppPathname`) · `env` (`getCurrentEnvironment`/`getCSPConnectSources`) · `types` (shared types). No `./types` subpath — everything is the barrel. |
| **Deps** | none. **Peer:** `next 16.2.10` (for metadata types) |
| **Consumers** | 129 import sites — app + every module + the bricks that read locales/env/logging (`utils`, `sanity`, `i18n`, `format`, `logger`, `security`) |

- **Gotcha — brand/SEO copy is Sanity, not config.** Only `site.url`
  (`NEXT_PUBLIC_SITE_URL`, else the `https://example.com` placeholder) stays in code;
  name/tagline/description/JSON-LD moved to Sanity singletons. The `pages` map is
  structural routing only (`key`/`id`/`slug`/`enabled`) — per-page SEO lives in Sanity
  `siteMeta.<locale>.pageSeo[pageId]`.
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

- [`code/packages/config/`](../../code/packages/config/) — the source
- [`code/packages/_registry.md`](../../code/packages/_registry.md) — roster + rule
