# @indiecrafts/config — site config data + shape

Auto-loads under `code/packages/config/**`. The shared config **primitives** (URL/prefix,
locales, Intl format defaults, env/CSP, logging) + the generic **page-config contract**
(`PageConfig` · `isPageVisible`) + shared types. **App-instance config** — `theme` · `fonts`
· `features` · the `pages` map — is **app-owned** (`apps/web/src/config`), so a second app
ships its own; this package never holds it. Area rules → `../../.claude/CLAUDE.md`.

**Stack:** TypeScript. The shared config-primitives surface (@indiecrafts/config) — i18n · format · env · logging · page contract.

- **This is DATA, not logic** — no `@/` app imports; a package never imports an app.
- **One `.` barrel, per-concern files.** `index.ts` is a curated re-export barrel; the data lives in
  `src/{site,i18n,format,seo,pages,env}.ts` + `types.ts` (types only — no data/fns/env). `pages.ts`
  is the **generic contract** (`PageConfig`/`PageSeo`/`isPageVisible`), not any app's route map.
  Add a primitive → edit the matching concern file + re-export from `index.ts`. **No `./types`
  subpath.** `env.ts` is the only file that reads `process.env` (besides `site.url`/`site.prefix`).
- **Brand/SEO copy is Sanity, not here** — only `site.url` + `site.prefix` stay in code; per-page SEO lives in Sanity.
- **`DEFAULT_SITE_PREFIX` / `site.prefix`** — the per-deployment namespace (env `NEXT_PUBLIC_SITE_PREFIX`). Prefixes browser keys (consent/theme/locale) + anchors the `wrangler.toml` deploy names; keep in sync with `pnpm project:rename <slug>`. Must be unique per client.
- `PageSeo.*Key` fields are plain `string` (the app message-key coupling was cut on extraction).
- Full reference → [`docs/packages/config.md`](../../../../docs/packages/config.md).
