# Table

> shadcn `table` · `src/user-interface/ui/table.tsx`

**Use when** presenting read-only structured data across two or more comparable columns (rows the user scans, sorts, or compares). **Don't** use it for page layout, single-record key/value pairs (use a description list), or an editable spreadsheet grid.

## Anatomy

- `Table` — wraps the `<table>` in a `data-slot="table-container"` div that owns `overflow-x-auto`; caption sits at the bottom (`caption-bottom`).
- `TableCaption` — optional accessible summary/title of the table (renders below).
- `TableHeader` (`<thead>`) → `TableRow` → `TableHead` (`<th>`) — column labels.
- `TableBody` (`<tbody>`) → `TableRow` → `TableCell` (`<td>`) — data rows.
- `TableFooter` (`<tfoot>`) — optional totals/summary row (`bg-muted/50`, medium weight).
- Optional column extras (not built-in): leading checkbox column for selection, trailing action-menu cell, sortable header button.

## Variants

No `cva` variants exist — one visual style. Compose the patterns below; keep the base intact.

| Variant         | Use for              | Base (Tailwind defaults + tokens)                                                                                                |
| --------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Default         | Any tabular data     | rows separated by `border-b`, `hover:bg-muted/50`, header text `text-foreground font-medium`                                     |
| Selectable rows | Bulk actions         | checkbox in first `TableHead`/`TableCell`; mark chosen rows `data-[state=selected]` → `bg-muted`                                 |
| Sortable header | User-ordered columns | render a `ghost` `Button` inside `TableHead` with a Lucide `ArrowUpDown` (16px, `aria-hidden`), toggle `aria-sort` on the `<th>` |
| Sticky header   | Long scroll regions  | `TableHeader` cells get `sticky top-0 z-10 bg-background`; scroll lives on the container, cap it with `max-h-*`                  |
| Numeric column  | Money, counts, %     | `text-right tabular-nums` on both the `TableHead` and its `TableCell`s                                                           |

## States

- **hover** (row) — `hover:bg-muted/50`, `transition-colors` (~160ms). Built in.
- **selected** (row) — `data-[state=selected]:bg-muted`; also flips on `has-aria-expanded`. Never rely on the tint alone — pair with a checked checkbox.
- **focus-visible** — interactive cell content (sort button, links, checkbox) carries `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`; the `<td>`/`<tr>` themselves are not focusable.
- **loading** — not built in. Render skeleton `TableRow`s (`bg-muted animate-pulse` cells) matching the real column count, or an overlay; keep the header visible so layout doesn't jump.
- **empty** — not built in. Render one `TableRow` with a `TableCell` spanning all columns (`colSpan={n}`), `text-center text-muted-foreground`, a short message + primary action.
- **disabled** — no per-row disabled state; dim non-actionable rows with `text-muted-foreground` and remove their interactive controls, don't fake a color.

## Hierarchy

Primary data surface of its region — usually one per view. If you have two, give each a `TableCaption` or heading; pair with pagination/toolbar above, not a second competing table.

## Restrictions

- Never add your own scroll wrapper — `Table` already ships `overflow-x-auto`; nest a second and you get double scrollbars or clipped sticky headers.
- Never edit `src/user-interface/ui/table.tsx` (shadcn, CLI-managed) — apply per-instance classes via `className` instead.
- Never center-align text columns or right-align text — text/labels left, numeric right with `tabular-nums`; center only icons/checkboxes.
- Never inline header labels or empty-state copy — they live in `messages/<locale>.json`.
- Never build sorting/filtering/pagination by hand — compose `@tanstack/react-table` with these primitives (per shadcn's own data-table guidance).
- Never omit `TableHeader`/`<th>` or use `<div>`s — screen readers need real `<th scope>` associations; don't use a table for non-tabular layout.
- Never zebra-stripe and border rows at once — the base uses `border-b`; pick one separator, not both.
- Never put a raw hex/px in a cell — density tweaks use spacing utilities (`py-4` comfortable, default `p-2` compact) and tokens only.

## Tokens

- **Color** — `text-foreground` (header), `text-muted-foreground` (caption/empty), `bg-muted`/`bg-muted/50` (selected row, footer, hover), `border-border` via `border-b`. Destructive cell text = `error` only.
- **Radius** — cells are square; if you frame the table in a Card use `rounded-md` (default) on the wrapper, not on cells.
- **Elevation** — flat by default; wrap in the `card` elevation (`ring-1 ring-border/60 shadow-sm`) only when it's a standalone panel.
- **Focus** — `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` on every interactive cell control.
- **Motion** — row hover/selection `transition-colors` ~160ms ease-out; guard skeleton pulse with `motion-reduce:animate-none`.
- **Type** — table body `text-sm`; header `font-medium`; caption `text-sm text-muted-foreground` (caption role). Numbers `tabular-nums`.

Sources:

- https://ui.shadcn.com/docs/components/table
- https://ant.design/components/table
- https://atlassian.design/components/dynamic-table/examples
