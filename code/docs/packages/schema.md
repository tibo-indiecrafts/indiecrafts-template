# `@indiecrafts/schema` — shared Sanity primitives

The reusable, document-agnostic Sanity **object types** that more than one owner
needs, so a module never reaches into the app (or a sibling module) for a field type.

|               |                                                                                                                            |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Exports**   | `.` → `sharedSanity` (the contribution) + `localeString` · `localeText` · `seoMeta`; `./*` → the raw schema files          |
| **Deps**      | `@indiecrafts/config` (locale set for `localeString`), `@indiecrafts/sanity` (the `SanityModule` type). **Peer:** `sanity` |
| **Consumers** | app + blog (every future module that needs SEO or per-locale copy)                                                         |

- **`localeString`** — one `string` per registered locale (generated from `@indiecrafts/config`
  `locales`), for short editor-managed copy: nav labels, blog comment copy. Read path:
  `value[locale] ?? value[defaultLocale]`.
- **`localeText`** — the multi-line sibling (`type:"text"` per locale), for longer editor-managed
  copy: email bodies, longer descriptions. Same generation + read path.
- **`seoMeta`** — slug-less SEO + visibility toggles (`noIndex` · `hideFromDiscovery` ·
  `unpublished` · `llmsSummary` · `llmsFull`), for documents that already own a slug.
- **`sharedSanity`** — the [contribution](/packages/sanity#composing-the-studio-config) that
  registers those objects once; every schema references them **by type name**.

- **Gotcha — only genuinely decoupled primitives live here.** `link`/`cta` stay in the blog
  because their internal target is a `post`; they graduate when a `page` document broadens
  that target. `metadata`/`blockContent` stay in the blog (post-specific / block-coupled).
