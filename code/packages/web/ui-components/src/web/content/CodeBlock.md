# CodeBlock

> Body `codeBlock` renderer · `renderers/CodeBlock.tsx`

**Use when** the article body carries a fenced code sample that needs syntax highlighting, with an optional filename/language header.

## Value

`value` is a `codeBlock` object (typed `unknown`, read defensively):

| Field      | Type     | Notes                                                   |
| ---------- | -------- | ------------------------------------------------------- |
| `code`     | `string` | The source. Renders `null` when empty/whitespace.       |
| `language` | `string` | Shiki grammar id (`ts`, `bash`, …); defaults to `text`. |
| `filename` | `string` | Shown in the header strip alongside the language badge. |

## Notes

- **Async server component** — Shiki runs at render time (`await codeToHtml`), so no highlighter JS ships to the client. Storybook unwraps it via the `Async` + `Suspense` helper.
- Theme-aware: highlighted with a `github-light` / `github-dark` pair; colours swap under `[data-theme="dark"]` through `@indiecrafts/packages-shared-ui-tokens` `.shiki` CSS.
- Unknown or unsupported languages degrade to a plain `<pre>` (Shiki throws on bad grammars) — no broken render, no highlighting.
- `not-prose` stops the typography plugin from restyling Shiki's markup.
- The header strip renders only when `filename` or `language` is set.
