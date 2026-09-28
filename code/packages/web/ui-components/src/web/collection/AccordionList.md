> `module.accordion-list` · `code/packages/ui-components/src/renderers/AccordionList.tsx`

**Use when** you have FAQ-style content — a list of questions or topics that each expand to reveal an answer.

## Fields

| Field     | Type      | Notes                                                         |
| --------- | --------- | ------------------------------------------------------------- |
| `items[]` | array     | Each: `title` (the summary) and `content` (PortableText).     |
| `inline`  | `boolean` | Optional; drop section chrome when embedded in a post body.   |
| `title`   | `string`  | Optional; schema field, not rendered by the current renderer. |
| `intro`   | `string`  | Optional; schema field, not rendered by the current renderer. |
| `anchor`  | `string`  | Optional; element `id`.                                       |

## Notes

- Server component. Pass `components={portableComponents}` — each answer is PortableText.
- Built on native `<details>`/`<summary>`: it opens and closes with **no JavaScript**, so it works before (and without) hydration.
- The `+` marker rotates on open (`group-open`); the default disclosure triangle is hidden.
- Renders nothing when `items` is empty.
