# `@indiecrafts/packages-web-i18n` — shared navigation shim

Auto-loads under `code/packages/web/i18n/**`. A thin next-intl navigation layer so **modules** get
`Link`/nav without importing the app. Area rules → `../../../.claude/CLAUDE.md`.

**Stack:** TypeScript · next-intl v4. Typed routing + message helpers.

- **Untyped on purpose** — the app keeps its OWN typed routing (`@/i18n/routing`, `PATHNAMES`).
- Modules use this shim; this brick exists to break the old blog→`@/i18n/routing` (up-pointing) inversion.
- Full reference → [`code/docs/packages/web/i18n.md`](../../../../docs/packages/web/i18n.md).
