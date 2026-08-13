# `@indiecrafts/config` — site config data + shape

The single source of site DATA (URL, locales, feature flags, theme, fonts, `pages` map)
plus its types and runtime helpers. Everything else reads from here — **never hard-code a
brand string, URL, color, or nav entry**.

| | |
| --- | --- |
| **Exports** | `.` → `src/index.ts` (config DATA + `localePrefix` + `localizedPathname(pathname, locale)`); `./types` → `src/types.ts` (config shape + `isLocale` · `isPageVisible` · `getCurrentEnvironment` · `getCSPConnectSources`, all re-exported through `.`) |
| **Deps** | none. **Peer:** `next 16.2.10` (for metadata types) |
| **Consumers** | app + blog (every brick that needs locales/env reads it too — `utils`, `sanity`, `i18n`) |

- **Gotcha — brand/SEO copy is Sanity, not config.** Only `site.url`
  (`NEXT_PUBLIC_SITE_URL`, else the `https://example.com` placeholder) stays in code;
  name/tagline/description/JSON-LD moved to Sanity singletons. The `pages` map is
  structural routing only (`key`/`id`/`slug`/`enabled`) — per-page SEO lives in Sanity
  `siteMeta.<locale>.pageSeo[pageId]`.
- **Gotcha — `PageSeo.*Key` fields are plain `string`**, not a message-key type: the
  coupling to the app's message keys was cut on extraction so config stays app-agnostic.

## Wiring & conventions

How every brick is consumed (exports · `transpilePackages` · resolution · Tailwind `@source`
· hardening), the ≥2-consumer rule → **[Packages overview](./)**.

- [`code/packages/config/`](../../code/packages/config/) — the source
- [`code/packages/_registry.md`](../../code/packages/_registry.md) — roster + rule
