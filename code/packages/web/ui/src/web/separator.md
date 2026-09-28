> shadcn `separator` · `src/user-interface/ui/separator.tsx`

**Use when** a thin rule visually or semantically divides two content groups (list rows, menu items, header/body). **Don't** use it as spacing — reach for margin/padding, or as a decorative page frame — use a border on the container.

## Anatomy

- A single 1px rule: `bg-border`, full-width (horizontal) or full-height (vertical). No label, no icon, no children.

## Variants

| Variant              | Use for                                                           | Base (Tailwind defaults + tokens)                                |
| -------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------- |
| Horizontal (default) | Divide stacked content top-to-bottom                              | `<Separator />` → `bg-border h-px w-full`                        |
| Vertical             | Divide inline items left-to-right; parent needs a height + `flex` | `<Separator orientation="vertical" />` → `bg-border w-px h-full` |
| Decorative (default) | Purely visual rule, no semantic meaning                           | `decorative` (default `true`) → no ARIA role                     |
| Semantic             | Rule that marks a real content boundary for assistive tech        | `<Separator decorative={false} />` → `role="separator"`          |

## States

None. The separator is non-interactive — no hover, focus, active, disabled, or loading. Never attach handlers or make it focusable.

## Hierarchy

Sits between sibling content groups, not around them. One per boundary; if a view needs a separator between every row, prefer a container `divide-y divide-border` over many instances.

## Restrictions

- Never wrap content or give it children — it is a self-closing rule.
- Never use it to add whitespace — that is spacing, not a divider.
- Never make it interactive, focusable, or color-only meaningful.
- Never hardcode a color or thickness — keep `bg-border` and the `h-px`/`w-px` defaults; a heavier rule means the wrong element (use a container border).
- Vertical needs a sized flex parent (e.g. `h-5`), or it collapses to nothing.
- Keep `decorative={false}` only when the divide is semantically real; default decorative is correct for most cosmetic rules.

## Tokens

- Color: `bg-border` (the only color; flips automatically in dark mode).
- Radius / elevation / motion: none — a separator is flat, static, unrounded.
- Focus: none — non-interactive, never in the tab order.

Sources:

- https://www.radix-ui.com/primitives/docs/components/separator
- https://ui.shadcn.com/docs/components/separator
