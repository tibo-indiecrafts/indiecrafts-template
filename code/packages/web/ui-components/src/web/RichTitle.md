> Shared title primitive · `web/RichTitle.tsx`

**Use when** rendering any heading from a string — an app section title (`messages/`) or a
Sanity title. Wrap a word in `[[ ]]` and it renders in the brand accent colour.
`"Built to [[cover]] your needs"` → _cover_ in `text-brand`.

## Props

| Prop        | Type                                            | Default | Notes                                                  |
| ----------- | ----------------------------------------------- | ------- | ------------------------------------------------------ |
| `children`  | `string`                                        | —       | The title text; may contain `[[ ]]` highlight markers. |
| `as`        | `"h1" \| "h2" \| "h3" \| "h4" \| "p" \| "span"` | `"h2"`  | The rendered element.                                  |
| `className` | `string`                                        | —       | The element's Tailwind classes, merged via `cn`.       |
| `id`        | `string`                                        | —       | Set when the heading is an `aria-labelledby` target.   |

## Notes

- **Owns no typography** — pass the type scale via `className` per call site. The only style it
  owns is the highlight span (`text-brand`).
- **Highlight is brand-only** — one accent colour, no palette. Theme-aware via the token (flips in
  dark mode automatically).
- **Server-safe** — pure, no hooks/state. Works in RSC and client components.
- **Marker-free strings are a no-op** — a string with no `[[ ]]` renders as one plain segment, so any
  existing title is safe to wrap. Unmatched `[[` or an empty `[[]]` render literally.
- The highlight is decorative emphasis — the full title still reads as one string, so it carries no
  colour-only meaning and needs no extra ARIA.
- Parser: `shared/rich-title.ts` (`splitHighlights`).
