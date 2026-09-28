> `module.step-list` · `code/packages/ui-components/src/renderers/StepList.tsx`

**Use when** you want an ordered how-it-works or setup flow — numbered steps, each with a title and a short body.

## Fields

| Field     | Type      | Notes                                                         |
| --------- | --------- | ------------------------------------------------------------- |
| `steps[]` | array     | Each: `title` and `content` (PortableText).                   |
| `inline`  | `boolean` | Optional; drop section chrome when embedded in a post body.   |
| `title`   | `string`  | Optional; schema field, not rendered by the current renderer. |
| `intro`   | `string`  | Optional; schema field, not rendered by the current renderer. |
| `anchor`  | `string`  | Optional; element `id`.                                       |

## Notes

- Server component. Pass `components={portableComponents}` — each step body is PortableText.
- Renders an ordered `<ol>` as a vertical timeline: numbered circles joined by a hairline connector.
- Renders nothing when `steps` is empty.
