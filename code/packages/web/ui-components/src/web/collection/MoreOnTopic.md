> `code/packages/web/ui-components/src/web/collection/MoreOnTopic.tsx`

**Use when** you want a compact list of links for a sidebar card — a heading over a few links, optionally with a "see all" footer link. The blog uses it for its `blog-related` card and for the sidebar form of its post blocks (`PostLinks`). Generic: any resolved `{ title, href }` items work.

## Props

| Prop        | Type                            | Notes                                            |
| ----------- | ------------------------------- | ------------------------------------------------ |
| `title`     | `string`                        | The heading (e.g. "More on Engineering").        |
| `items[]`   | `{ title, href, meta?, _key? }` | The links. `meta` is an optional secondary line. |
| `footer`    | `{ label, href }`               | Optional "see all" link under the list.          |
| `className` | `string`                        | Optional; extra classes on the section.          |

## Notes

- Renders `null` when `items` is empty.
- Plain `<a href>` (resolved hrefs), matching the other renderers — the host localizes the hrefs.
- Bare: `SidebarCard` draws the card frame around it.
