> `module.feature-grid` · `code/packages/ui-components/src/web/collection/FeatureGrid.tsx`

**Use when** you want a centered title/intro over a grid of icon cards — each an icon chip, a title, and a short body. Good for a feature overview.

## Fields

| Field     | Type     | Notes                                                                     |
| --------- | -------- | ------------------------------------------------------------------------- |
| `items[]` | array    | Each: `icon`, `title`, `body`. **Required** — renders nothing when empty. |
| `title`   | `string` | Optional; centered heading above the grid.                                |
| `intro`   | `string` | Optional; short line under the title.                                     |
| `anchor`  | `string` | Optional; element `id`.                                                   |

`item.icon` is one of the fixed Lucide glyphs: `zap`, `settings`, `sparkles`, `shield`, `globe`, `users`.

## Notes

- Server component. Renders `null` when `items` is empty.
- Icons come from a fixed set (`FeatureIcon`) — a missing or unknown icon falls back to `sparkles`.
- Single column on small screens; three columns at `@4xl` (container query).
