# Badge

> shadcn `badge` · `src/user-interface/ui/badge.tsx`

**Use when** labeling an item's status, category, or attribute with a short, static, at-a-glance word. **Don't** use it as a button, a numeric count bubble, or a chip the user removes/toggles — those are Button, a count indicator, and an interactive Tag/Chip respectively.

## Anatomy

- Optional leading icon (Lucide, 12px — `[&>svg]:size-3`, `aria-hidden`)
- Label text (one word; two only for a compound state like "Partially refunded", past tense)
- Pill container (`rounded-full`, `border`, `px-2 py-0.5`)

## Variants

| Variant       | Use for                                                   | Base (Tailwind defaults + tokens)                        |
| ------------- | --------------------------------------------------------- | -------------------------------------------------------- |
| `default`     | The one emphasized/primary status per view                | `bg-primary text-primary-foreground` (repo `brand` role) |
| `secondary`   | Neutral/passive status — the everyday default in practice | `bg-secondary text-secondary-foreground`                 |
| `destructive` | Error / critical / failed state only                      | `bg-destructive text-white` (repo `error` role)          |
| `outline`     | Low-emphasis category/label on busy surfaces              | `border-border text-foreground`                          |
| `ghost`       | Quietest label, no fill or border                         | transparent, `text` inherits                             |
| `link`        | Label that navigates (rare — pair with `asChild`)         | `text-primary underline-offset-4`                        |

## States

- **hover** — only when interactive via `asChild` on an `<a>` (`[a&]:hover:bg-*/90`, or `hover:underline` for `link`). A plain `<span>` badge has no hover.
- **focus-visible** — `focus-visible:border-ring focus-visible:ring-ring/50 ring-[3px]`; present only when the badge is an interactive element (`asChild` → link/button).
- **error** — `aria-invalid` → `aria-invalid:border-destructive aria-invalid:ring-destructive/20`.
- No `disabled`, `active`, or `loading` — a status label is not a control.

## Hierarchy

Sits below Button and Lozenge-style status; at most one `default` (emphasized) badge per row/card — everything else is `secondary`/`outline`/`ghost`. Many identical badges in a list is fine; many _different_ colors competing is not.

## Restrictions

- Never use a badge for a **count** (e.g. "3 unread") — that is a numeric indicator, not this component.
- Never make it clickable by adding `onClick` to the `<span>` — use `asChild` with an `<a>`/`<button>` so focus, roles, and keyboard come for free.
- Never signal state by **color alone** — the label word carries the meaning (color reinforces it). WCAG + repo rule.
- Never hard-code a status color — use the `variant` token; if a needed status role (success/warning/info) has no variant, propose it in `DESIGN.md`, don't inline a hex.
- Never grow it into a dismissible/removable chip — that is a different, interactive component.
- Keep the label short; it is `whitespace-nowrap` and will overflow-hide, not wrap.

## Tokens

- **Color:** `bg-primary`/`text-primary-foreground` (brand), `bg-secondary`, `bg-destructive` (error), `border-border`, `text-foreground` — all theme-flipping, no `dark:` forks needed.
- **Radius:** `rounded-full` (fixed pill; not the `rounded-md` default).
- **Elevation:** flat — no shadow or ring except the transient focus ring.
- **Type:** `text-xs font-medium` (caption scale).
- **Focus:** `focus-visible:ring-ring/50 ring-[3px]` (interactive use only).
- **Motion:** `transition-[color,box-shadow]` (color/focus only; no layout motion).

Sources:

- [Carbon Design System — Tag usage](https://carbondesignsystem.com/components/tag/usage/)
- [Shopify Polaris — Badge](https://polaris-react.shopify.com/components/feedback-indicators/badge)
- [Atlassian Design System — Lozenge](https://atlassian.design/components/lozenge)
- [Atlassian Design System — Badge (numeric)](https://atlassian.design/components/badge)
