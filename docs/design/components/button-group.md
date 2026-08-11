# Button group

> shadcn `button-group` · `src/user-interface/ui/button-group.tsx`

**Use when** you have 2–3 related actions (or connected controls like a split button / input add-on) that belong together. **Don't** use it to toggle a state (that's `ToggleGroup`) or to hold >3 primary actions — collapse the overflow into a menu.

## Anatomy

- `ButtonGroup` — `role="group"` wrapper, `w-fit`, `items-stretch`; collapses inner radii + shared borders so children read as one connected control.
- Children — `Button` (or `Input` / `Select` / `InputGroup`), left→right (horizontal) or top→bottom (`orientation="vertical"`).
- `ButtonGroupSeparator` — thin `bg-input` divider between fill/ghost buttons; **omit it for `outline` buttons** (their border already divides).
- `ButtonGroupText` — non-interactive `bg-muted` label/prefix segment inside the group.

## Variants

The component has no `variant` prop — the group is a layout shell; each child `Button` carries its own variant. Only `orientation` varies the shell.

| Variant                  | Use for                                | Base (Tailwind defaults + tokens)                                              |
| ------------------------ | -------------------------------------- | ------------------------------------------------------------------------------ |
| horizontal (default)     | Toolbars, split buttons, input add-ons | `flex w-fit items-stretch`; inner corners squared, inner `border-l` removed    |
| vertical                 | Stacked action rails, narrow columns   | `flex-col`; inner corners squared, inner `border-t` removed                    |
| nested (group of groups) | Spaced clusters in one toolbar         | wrap sibling `ButtonGroup`s → auto `gap-2` between them                        |
| split button             | Primary action + dropdown              | `Button` + `ButtonGroupSeparator` + `Button` (chevron) wired to `DropdownMenu` |

**Child action mix:** exactly one primary (`bg-brand text-brand-foreground`); pair the rest as `outline`/`ghost`. Two `bg-brand` buttons side by side is wrong — one primary per group. Destructive child uses the `error` role only.

## States

States live on the child `Button`, not the shell. The group only adds:

- **focus-visible** — `[&>*]:focus-visible:relative [&>*]:focus-visible:z-10` so the focused child's `ring-2 ring-ring` sits above neighbors' collapsed borders. Never remove this; the ring is clipped otherwise.
- Each child keeps its own hover / active / disabled / loading tokens — the group changes geometry, not interaction feedback.

## Hierarchy

One button group per toolbar region; at most 3 actions inside. Ordering: primary first when left-aligned (Carbon), primary last when right-aligned in a dialog footer — follow the surface's convention, don't hard-code.

## Restrictions

- Never use it as a segmented toggle / view-switcher — reach for `ToggleGroup` (single-select state), not `ButtonGroup`.
- Never put more than 3 actions in one group — overflow goes to a menu button.
- Never ship it without `aria-label` / `aria-labelledby` — `role="group"` is unnamed otherwise.
- Never stack two primary (`bg-brand`) buttons in the same group.
- Never add a `ButtonGroupSeparator` between `outline` buttons — you'll get a double line.
- Never strip the `focus-visible:z-10` rule to "clean up" classes — it's what keeps the focus ring visible.
- Never hard-code widths/colors — mix child variants; let the group stay `w-fit`.

## Tokens

- **Color** — `bg-muted` (text segment), `bg-input` (separator); child actions use `bg-brand`/`text-brand-foreground` (primary), `border-border` (outline), `error` (destructive).
- **Radius** — `rounded-md` (default) on the group's outer corners; inner corners squared by the shell.
- **Elevation** — flat by default; `ButtonGroupText` carries `shadow-xs`. Don't add `shadow-md`/`shadow-lg` — a connected control reads flat.
- **Focus** — `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` on every child (from `Button`), lifted with `z-10` by the group.
- **Motion** — none on the shell; child hover transitions inherit the 160ms ease-out `Button` default. Guard any addition with `motion-reduce:`.

Sources:

- https://ui.shadcn.com/docs/components/radix/button-group
- https://m3.material.io/components/segmented-buttons
- https://carbondesignsystem.com/components/button/usage/
- https://polaris-react.shopify.com/components/actions/button-group
