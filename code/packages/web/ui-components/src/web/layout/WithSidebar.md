> `code/packages/web/ui-components/src/web/layout/WithSidebar.tsx`

**Use when** a page shows sidebar cards beside its content. The website wraps every page type in it (through `PageSidebar`, or `postSidebar` beside a post body); the cards come from Site web → Barre latérale.

## Props

| Prop        | Type        | Default | Notes                                                                      |
| ----------- | ----------- | ------- | -------------------------------------------------------------------------- |
| `aside`     | `ReactNode` | —       | The cards (each in a `SidebarCard`). None → the children render unchanged. |
| `label`     | `string`    | —       | The sidebar's accessible name (a visually hidden `h2`).                    |
| `contained` | `boolean`   | `true`  | Adds the page container and zeroes the inner sections' gutter.             |
| `className` | `string`    | —       | Extra classes on the grid, merged via `cn`.                                |

## Notes

- From `lg`: content and an 18rem column; the cards stick below the header and scroll on their own when taller than the screen.
- Below `lg`: the cards follow the content, two per row from `sm`. DOM order = reading order (WCAG 1.3.2): the `<aside>` comes after the content in the markup, never moved with CSS `order`.
- One sidebar per page: the heading id is `page-sidebar-title`.
