# @indiecrafts/packages-shared-config — site config data + shape

Auto-loads under `code/packages/shared/config/**`. The shared config **primitives** (URL/prefix,
locales, Intl format defaults, env/CSP, logging) + the generic **page-config contract**
(`PageConfig` · `isPageVisible`) + shared types. **App-instance config** — `theme` · `fonts`
· `features` · the `pages` map — is **app-owned** (each surface's `src/config`), so a second app
ships its own; this package never holds it. Area rules → `../../../.claude/CLAUDE.md`.

**Stack:** TypeScript. The shared config-primitives surface (@indiecrafts/packages-shared-config) — i18n · format · env · logging · page contract.

- **This is DATA, not logic** — no `@/` app imports; a package never imports an app.
- **Split by portability into scope folders** (mirrors the projects tree):
  - `src/shared/` — PLATFORM-AGNOSTIC core: `i18n` · `format` · `types` (pure TS, no `next`/DOM/env).
    Any platform imports it via `@indiecrafts/packages-shared-config/shared`.
  - `src/web/` — WEB-only: `site` (URL/prefix, reads env) · `env` (CSP) · `seo` · `pages` (the generic
    `PageConfig`/`PageSeo`/`isPageVisible` contract). `pages.ts` carries a LOCAL `Robots` type — **never
    import `next`** here (services + mobile/hybrid consume this package).
  - `src/mobile/` · `src/hybrid/` — reserved: re-export `../shared` today (`@indiecrafts/packages-shared-config/mobile`
    · `/hybrid`); add platform-specific primitives as those apps grow.
  - `src/index.ts` — the root `.` barrel = `shared` + `web` (the web surface), so web apps keep one
    import. Subpath exports: `.` · `./shared` · `./web` · `./mobile` · `./hybrid`.
    Add a primitive → edit the matching concern file in its scope + re-export from that scope's `index.ts`.
    `env.ts` is the only file that reads `process.env` (besides `site.url`/`site.prefix`).
- **Brand/SEO copy is Sanity, not here** — only `site.url` + `site.prefix` stay in code; per-page SEO lives in Sanity.
- **`DEFAULT_SITE_PREFIX` / `site.prefix`** — the per-deployment namespace (env `NEXT_PUBLIC_SITE_PREFIX`). Prefixes browser keys (consent/theme/locale) + anchors the `wrangler.toml` deploy names; keep in sync with `pnpm project:rename <slug>`. Must be unique per client.
- `PageSeo.*Key` fields are plain `string` (the app message-key coupling was cut on extraction).
- Full reference → [`code/docs/packages/config.md`](../../../../docs/packages/config.md).
