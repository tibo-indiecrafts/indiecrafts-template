# @indiecrafts/config — site config data + shape

Auto-loads under `code/packages/config/**`. The single source of site DATA (URL, locales,
feature flags, theme, fonts, `pages` map) + its types/helpers. Area rules → `../../.claude/CLAUDE.md`.

- **This is DATA, not logic** — no `@/` app imports; a package never imports an app.
- **Brand/SEO copy is Sanity, not here** — only `site.url` stays in code; per-page SEO lives in Sanity.
- `PageSeo.*Key` fields are plain `string` (the app message-key coupling was cut on extraction).
- Full reference → [`docs/packages/config.md`](../../../../docs/packages/config.md).
