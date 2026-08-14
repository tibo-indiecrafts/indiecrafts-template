# CustomHtml

> `module.custom-html` renderer · `renderers/CustomHtml.tsx`

**Use when** the editor needs raw markup no other block covers — an embed script, a third-party widget, a pasted iframe. The escape hatch; reach for a typed block first.

## Fields

| Field    | Type     | Notes                                              |
| -------- | -------- | -------------------------------------------------- |
| `html`   | `string` | Raw markup. Renders `null` when empty.             |
| `anchor` | `string` | Sets the section `id` for in-page links.           |

## Notes

- Server component — renders via `dangerouslySetInnerHTML`.
- **Trust the source.** Any editor with Studio access can inject arbitrary HTML/JS. Lock down with Sanity roles if that is a concern — there is no sanitization here.
- Any descendant `<iframe>` is forced to full column width (`[&_iframe]:w-full`), overriding the hard-coded `width` editors paste from embed codes. Height stays as authored — wrap in a ratio box for responsive height.
- Section spacing (`py-8 md:py-12`) matches the other blocks so the embed does not read narrower than its neighbours.
