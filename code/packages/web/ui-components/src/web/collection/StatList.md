# StatList

> `module.stat-list` · `code/packages/ui-components/src/renderers/StatList.tsx`

**Use when** you want to show a few headline metrics — users, uptime, rating — as a compact row of value + label cells.

## Fields

| Field     | Type      | Notes                                                         |
| --------- | --------- | ------------------------------------------------------------- |
| `stats[]` | array     | Each: `value` (the number) and `label` (what it measures).    |
| `inline`  | `boolean` | Optional; drop section chrome when embedded in a post body.   |
| `title`   | `string`  | Optional; schema field, not rendered by the current renderer. |
| `intro`   | `string`  | Optional; schema field, not rendered by the current renderer. |
| `anchor`  | `string`  | Optional; element `id`.                                       |

## Notes

- Server component. No `components` prop — the cells are plain text, not PortableText.
- Layout: 4 columns when there are 4+ stats, otherwise 3.
- Semantic `<dl>`/`<dt>`/`<dd>`; values use `tabular-nums` so they align.
- Renders nothing when `stats` is empty.
