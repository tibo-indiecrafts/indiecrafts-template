# `@indiecrafts/packages-web-schema` — shared Sanity object primitives

Auto-loads under `code/packages/web/schema/**`. The reusable, doc-agnostic field types more than one
owner needs: `localeString · localeText · seoMeta` + the `sharedSanity` barrel. Area rules →
`../../../.claude/CLAUDE.md`.

**Stack:** Sanity v6 · TypeScript. Shared Sanity object primitives, registered once, referenced by type name.

- **`localeString` / `localeText`** — per-locale field objects (`string` / multiline `text`),
  **generated from `@indiecrafts/packages-shared-config` `locales`** so the language set can never drift. Add a
  locale there and each object grows a field automatically. Read path: `value[locale] ?? value[default]`.
- **`seoMeta`** — the ONE per-page SEO + LLMs + visibility model, carried as `.seo` on every document a route renders.
- **`sharedSanity`** (the `.` barrel, `src/index.ts`) — the `SanityModule` contribution that registers
  the three primitives; app + blog wire it into a `composeStudio` group. Also re-exports each primitive by name.
- Each primitive is the `./*` wildcard export (so it needs a tsconfig `paths` entry).
- Depends on `@indiecrafts/packages-shared-config` + `@indiecrafts/packages-web-sanity`. **Peer:** `sanity`. Never imports an app or a module.
- Full reference → [`code/docs/packages/schema.md`](../../../../docs/packages/schema.md).
