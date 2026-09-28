> shadcn `item` · `src/user-interface/ui/item.tsx`

**Use when** laying out a content row — media + title + description + trailing actions — in a list of users, settings, results, or resources. **Don't** use it to host form inputs (checkbox, input, radio, select) — that's `Field`; Item is content-only.

## Anatomy

- `ItemGroup` — `role="list"` wrapper; stack rows, insert `ItemSeparator` between them.
- `Item` — the row (flex, wraps). Left → right:
  - `ItemMedia` — leading icon / image / avatar (optional).
  - `ItemContent` — grows to fill; stacks `ItemTitle` then `ItemDescription`.
  - `ItemActions` — trailing buttons / controls (optional).
- `ItemHeader` / `ItemFooter` — full-width band above / below the main row (optional).

## Variants

| Variant   | Use for                                            | Base (Tailwind defaults + tokens)     |
| --------- | -------------------------------------------------- | ------------------------------------- |
| `default` | Rows inside a bordered `ItemGroup` or divided list | `bg-transparent` (transparent border) |
| `outline` | A standalone row that needs its own edge           | `border-border`                       |
| `muted`   | Secondary / de-emphasized row (not disabled)       | `bg-muted/50`                         |

`ItemMedia` has its own axis: `default` (bare icon), `icon` (`size-8 rounded-sm border bg-muted`, 16px glyph), `image` (`size-10 rounded-sm`, cover-cropped).

## Sizes

| Size      | Height         | Padding                | Text      |
| --------- | -------------- | ---------------------- | --------- |
| `default` | content-driven | `p-4` (16px), `gap-4`  | `text-sm` |
| `sm`      | content-driven | `px-4 py-3`, `gap-2.5` | `text-sm` |

Height is intrinsic (grows with description lines) — never force a fixed `h-*`. Only these two sizes exist here; upstream shadcn's `xs` is not in this repo.

## States

- **hover** — only when the row is a link/button (`asChild`): `[a]:hover:bg-accent/50`. A static `<div>` Item has no hover.
- **focus-visible** — `focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none` (applies once the row is interactive via `asChild`).
- **active / loading** — none built in; add on the interactive child, guard with `motion-reduce:`.
- **disabled** — no built-in style; if a row is unavailable, disable the control inside `ItemActions` and pair a text/icon cue — never signal by `muted` color alone.
- **selected** — not built in; add `data-[selected]:bg-accent` + a visible check/marker, never color alone.

## Hierarchy

One list of sibling Items per region; give `ItemTitle` the only `font-medium` weight so it reads as the row's anchor, description stays `text-muted-foreground`.

## Restrictions

- Never nest interactive inside interactive — an `asChild` link/button Item must NOT contain buttons/links in `ItemActions` (invalid a11y). Pick one: whole-row click OR trailing actions.
- Never put form controls in an Item — use `Field`.
- Never hardcode padding to fake a size — use the `size` prop; never add a raw `h-14`/hex/px.
- Never make a static `<div>` Item look clickable — no hover/cursor styling unless it's a real link/button via `asChild` + `@/i18n/routing`.
- Never route with `next/link`; when the row is a link, pass an `@/i18n/routing` `Link` through `asChild`.
- Don't confuse `muted` (secondary content) with disabled or selected — those need their own cue.
- Don't overload `ItemMedia` sizing — `icon` is a 32px box, not the 40px control height.

## Tokens

- **Color** — `bg-transparent` / `border-border` / `bg-muted/50` (variants); `text-foreground` title, `text-muted-foreground` description; hover `bg-accent/50`; media `bg-muted`.
- **Radius** — `rounded-md` (row), `rounded-sm` (media).
- **Elevation** — flat; lean on `ItemGroup` borders / `ItemSeparator`, not shadow.
- **Focus** — `focus-visible:ring-[3px] ring-ring/50 border-ring outline-none` (shadcn focus pattern; interactive rows only).
- **Motion** — `transition-colors duration-100`; guard any added motion with `motion-reduce:`.
- **Type** — title `text-sm font-medium leading-snug`; description `text-sm text-muted-foreground line-clamp-2 text-balance`.
- **Icons** — Lucide, 16px in the `icon` media box, `aria-hidden` unless the sole label.

Sources:

- https://ui.shadcn.com/docs/components/base/item
- https://m3.material.io/components/lists/guidelines
- https://polaris-react.shopify.com/components/lists/resource-item
- https://atlassian.design/components/menu/button-item/
