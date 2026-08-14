# PersonList

> `module.person-list` · `code/packages/ui-components/src/renderers/PersonList.tsx`

**Use when** you want a people or team grid — a set of members shown as avatar, name, and role.

## Fields

| Field      | Type      | Notes                                                                     |
| ---------- | --------- | ------------------------------------------------------------------------- |
| `people[]` | array     | Each: `name`, `role`, `image` (rendered); `bio`, `social[]` (see Notes).  |
| `inline`   | `boolean` | Optional; drop section chrome when embedded in a post body.               |
| `title`    | `string`  | Optional; schema field, not rendered by the current renderer.             |
| `intro`    | `string`  | Optional; schema field, not rendered by the current renderer.             |
| `anchor`   | `string`  | Optional; element `id`.                                                   |

## Notes

- Server component. No `components` prop.
- The renderer shows **image, name, and role only** — `bio` and `social` are in the schema but the current renderer does not display them.
- Missing images fall back to a neutral placeholder box.
- Responsive via `@container`: 2 columns, 3 at `@xl`. Renders nothing when `people` is empty.
