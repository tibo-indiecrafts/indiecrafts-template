# @indiecrafts/packages-web-locale-suggest — "available in your language" strip

Auto-loads under `code/packages/web/locale-suggest/**`. Suggests (never auto-redirects) a locale
switch when the active locale ≠ the browser preference — a Sanity copy singleton + a client banner +
the pure `detectPreferredLocale`. Consumed by the website `DefaultLayout`. Area rules →
`../../../.claude/CLAUDE.md`.

**Stack:** React 19 · Sanity v6 · next-sanity. Deps: web-ui · web-i18n (`useLocaleSwitch`) · web-sanity · shared-config.

- **Exports:** `./*` → `src/*` (no root `.`) — import a subpath (`.../detect`, `.../LocaleSuggest`,
  `.../locale-suggest-store`, `.../sanity/...`).
- **Only the `Accept-Language` HTTP parser is web-specific** — the decision delegates to shared
  `pickSuggestedLocale` (`packages-shared-config`) so native shells reuse it. Suggest only; language
  names, never flags.
- **`detect.ts` is unit-tested** (`detect.test.ts`, `pnpm test`) — keep the pure detector pure.

Full reference → [`code/docs/packages/locale-suggest.md`](../../../../docs/packages/locale-suggest.md).
