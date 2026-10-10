> Shared section shell · `renderers/ModuleSection.tsx`

**Use when** a module needs the standard section frame — centered max-width, page gutters, vertical rhythm — that works both as a full-width page slot and as an inline body embed.

## Props

| Prop        | Type              | Default | Notes                                    |
| ----------- | ----------------- | ------- | ---------------------------------------- |
| `children`  | `React.ReactNode` | —       | The module's own markup.                 |
| `inline`    | `boolean`         | `false` | `true` drops the chrome (see below).     |
| `anchor`    | `string`          | —       | Sets the element `id` for in-page links. |
| `className` | `string`          | —       | Extra classes, merged via `cn`.          |

## Notes

- Server component — a pure layout wrapper.
- Both modes take the full width (`w-full`), so a block that makes it a size container never collapses in a shrink-to-fit parent.
- Slot mode (default): a centered `<section>` at `max-w-6xl` with page gutters (`px-(--gutter)`) and `py-8 md:py-12`.
- `inline` mode: a bare `<div>` with `not-prose` + `my-8` only. Use inside an article `.prose` column, which already owns width and padding — the gutter would otherwise double-pad and squeeze the module on mobile. `not-prose` stops the typography plugin restyling the module's markup.
