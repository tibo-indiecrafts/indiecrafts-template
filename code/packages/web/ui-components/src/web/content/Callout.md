> `module.callout` · `code/packages/ui-components/src/renderers/Callout.tsx`

**Use when** you need a highlighted aside inside a page or post body — a tip, a status note, a warning, or a small call-to-action set apart from the surrounding prose.

## Fields

| Field     | Type                                   | Notes                                                           |
| --------- | -------------------------------------- | --------------------------------------------------------------- |
| `variant` | `info \| success \| warning \| danger` | Optional; sets the color scheme. Defaults to `info`.            |
| `content` | PortableText                           | Required. The body; the block renders nothing without it.       |
| `cta`     | `{ link, variant }`                    | Optional button under the body (`primary`/`secondary`/`ghost`). |
| `anchor`  | `string`                               | Optional; becomes the element `id` for deep links.              |

## Notes

- Server component. Renders an `<aside>`; pass `components={portableComponents}` so the PortableText body resolves.
- Accessibility: every variant is `role="note"` — a callout is static editorial content, and `role="alert"` would interrupt screen-reader users on page load.
- The CTA renders only when its `link` has both `href` and `label`.
