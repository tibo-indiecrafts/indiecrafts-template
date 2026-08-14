# QuoteList

> `module.quote-list` · `code/packages/ui-components/src/renderers/QuoteList.tsx`

**Use when** you want testimonial quotes — a stacked list of pull quotes, each with an author, role, and optional avatar.

## Fields

| Field      | Type     | Notes                                                         |
| ---------- | -------- | ------------------------------------------------------------- |
| `quotes[]` | array    | Each: `content` (the quote), `author`, `role`, `image`.       |
| `title`    | `string` | Optional; schema field, not rendered by the current renderer. |
| `anchor`   | `string` | Optional; element `id`.                                       |

## Notes

- **Async server component.** It reads locale-aware quotation marks from the `typography.quoteStyle.primary` message (via `getTranslations`), so it needs the next-intl provider in scope. No `components` prop.
- The open/close marks wrap each quote's `content` (e.g. `“…”` in EN, `« … »` in FR).
- Null quote entries are filtered; the block renders nothing when none remain.
