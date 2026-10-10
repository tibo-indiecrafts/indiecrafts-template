> `code/packages/web/ui-components/src/web/layout/SidebarCard.tsx`

**Use when** you place one page-builder block in a sidebar. It draws the site's card frame (`bg-card` + hairline ring) around the block, unless the block draws its own (callout, the forms). The card and stat lists get the frame: their hairline grid shows no edge with one item.

## Props

| Prop        | Type        | Notes                                             |
| ----------- | ----------- | ------------------------------------------------- |
| `type`      | `string`    | The block's `_type`; decides the frame.           |
| `className` | `string`    | Extra classes (e.g. `max-lg:hidden` for the TOC). |
| `children`  | `ReactNode` | The rendered block, `inline`.                     |

## Notes

- A container (`@container`): the block sizes to the card, not the screen.
- Drops the block's own outer margin; the sidebar grid spaces the cards.
- A block that renders nothing leaves no empty card (`empty:hidden`).
