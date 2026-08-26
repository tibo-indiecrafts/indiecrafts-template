# MoreOnTopic

> `code/packages/ui-components/src/web/collection/MoreOnTopic.tsx`

**Use when** you want a compact "more on this topic" list in a sidebar — a heading over a few related links, optionally with a "see all" footer link. Built for the blog post TOC sidebar, but generic: any resolved `{ title, href }` items work.

## Props

| Prop        | Type                            | Notes                                            |
| ----------- | ------------------------------- | ------------------------------------------------ |
| `title`     | `string`                        | The heading (e.g. "More on Engineering").        |
| `items[]`   | `{ title, href, meta?, _key? }` | The links. `meta` is an optional secondary line. |
| `footer`    | `{ label, href }`               | Optional "see all" link under the list.          |
| `className` | `string`                        | Optional; extra classes on the card.             |

## Notes

- Renders `null` when `items` is empty.
- Plain `<a href>` (resolved hrefs), matching the other renderers — the host localizes the hrefs.
- Token-styled card (`bg-card` + hairline ring); sized for a narrow column.
