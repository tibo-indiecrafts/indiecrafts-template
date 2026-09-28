> `module.custom-html` renderer · `renderers/CustomHtml.tsx`

**Use when** the editor needs raw markup no other block covers — an embed script, a third-party widget, a pasted iframe. The escape hatch; reach for a typed block first.

## Fields

| Field    | Type                    | Notes                                                                                                                       |
| -------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `html`   | `string`                | Raw markup. Renders `null` when empty.                                                                                      |
| `width`  | `"contained" \| "full"` | `contained` (default) = `max-w-6xl` + gutter, sits with the other blocks; `full` = spans the viewport, still with a gutter. |
| `anchor` | `string`                | Sets the section `id` for in-page links.                                                                                    |

## Notes

- Server component — renders via `dangerouslySetInnerHTML`.
- **Trust the source.** Any editor with Studio access can inject arbitrary HTML/JS. Lock down with Sanity roles if that is a concern — there is no sanitization here.
- **Width & forms.** Pick `full` for a form/banner that should stretch; it keeps a gutter so content never touches the screen edges. A block-level `<form>` fills the container, and any descendant `<iframe>` is forced to full width (`[&_iframe]:w-full`) — but a raw `<input>`/`<button>` renders at its intrinsic width, so **style your own control widths** in the pasted markup (provider embeds usually do this already).
- **Inline (blog body).** Rendered inside the article's `.prose` column, the block drops its own width/gutter (the column owns them) — `width` only applies on a page.
- **External providers need CSP allowlisting.** A form that POSTs to an external provider, or loads its script/iframe (Mailchimp, ConvertKit, Google Forms…), is blocked until its host is added to `EMBED_HOSTS` in `next.config.ts` (flows into `form-action` + `script-src` + `connect-src` + `frame-src`). A same-origin form (POST `/api/newsletter`) needs nothing.
