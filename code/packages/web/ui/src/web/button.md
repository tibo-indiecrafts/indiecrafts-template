> shadcn `button` · `src/user-interface/ui/button.tsx`

**Use when** a user triggers an action or navigates a primary flow (submit, save, confirm, open). **Don't** use for plain in-text navigation — that's a link (`@/i18n/routing`), styled with `buttonVariants` only if it must look like a button.

## Anatomy

- **Container** — the CVA-styled `<button>` (or any element via `asChild`). Sets height, padding, radius, focus ring.
- **Leading icon** (optional) — Lucide, `size-4` default, `aria-hidden`. Padding tightens automatically (`has-[>svg]:px-3`).
- **Label** — one action-oriented verb phrase, sentence case ("Save changes", not "OK" / "Click here"). Kept to `whitespace-nowrap`.
- **Trailing icon** (optional) — direction/disclosure only (chevron, external-link).

## Variants

Variants encode **emphasis**, not decoration: the more important the action, the more emphasis. Cross-system rule (Material 3, Carbon, Polaris): pick by importance, not by taste.

| Variant       | Use for                                                               | Base (as shipped in `button.tsx`)                                                                                                              |
| ------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `default`     | The one primary action of a view (Save, Confirm, Continue)            | `bg-primary text-primary-foreground hover:bg-primary/90` — per `DESIGN.md` the primary action maps to **`bg-brand` / `text-brand-foreground`** |
| `secondary`   | Middle-emphasis alternative next to a primary                         | `bg-secondary text-secondary-foreground hover:bg-secondary/80`                                                                                 |
| `outline`     | Secondary action that must stay visible (Cancel beside Save)          | `border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground`                                                                  |
| `ghost`       | Low-emphasis / repeated actions (toolbar, table rows)                 | `hover:bg-accent hover:text-accent-foreground`                                                                                                 |
| `link`        | Lowest emphasis; reads as inline navigation                           | `text-primary underline-offset-4 hover:underline`                                                                                              |
| `destructive` | **Only** genuinely destructive, irreversible actions (Delete, Remove) | `bg-destructive text-white hover:bg-destructive/90` — per `DESIGN.md` destructive maps to the **`error`** role                                 |

## Sizes

Default is `h-9` (36px). Touch targets must be **≥40px** — use `lg` (or `icon-lg`) on mobile/touch surfaces (`DESIGN.md` § control sizing).

| Size                                       | Height                         | Padding | Text      |
| ------------------------------------------ | ------------------------------ | ------- | --------- |
| `xs`                                       | `h-6` (24px)                   | `px-2`  | `text-xs` |
| `sm`                                       | `h-8` (32px)                   | `px-3`  | `text-sm` |
| `default`                                  | `h-9` (36px)                   | `px-4`  | `text-sm` |
| `lg`                                       | `h-10` (40px)                  | `px-6`  | `text-sm` |
| `icon` / `icon-xs` / `icon-sm` / `icon-lg` | `size-9` / `-6` / `-8` / `-10` | square  | —         |

## States

- **hover** — per-variant tint (`hover:bg-primary/90`, `hover:bg-accent`). Never the only affordance; the label already reads as clickable.
- **focus-visible** — `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`, `outline-none`. Always present on every interactive button — never strip it.
- **active/pressed** — inherited from the hover tint via `transition-all`; no separate class needed.
- **disabled** — `disabled:opacity-50 disabled:pointer-events-none`. Prefer avoiding disabled primary actions; if used, the reason must be discoverable elsewhere (opacity alone is not a status signal).
- **invalid** — `aria-invalid` drives `aria-invalid:border-destructive aria-invalid:ring-destructive/20` for form-submit buttons.
- **loading** — not built in. Add a Lucide spinner as the leading icon with `animate-spin motion-reduce:animate-none`, set `disabled` + `aria-busy="true"`, and keep the label (don't collapse to icon-only).

## Hierarchy

**One primary (`default`) per view or button group** (Material 3, Carbon, Polaris consensus). Everything else steps down: `secondary`/`outline` → `ghost` → `link`. In a group, primary sits outermost; Cancel is `outline`/`ghost`, never a second `default`.

## Restrictions

- Never render two `default` buttons competing in the same view — reader can't find the primary path.
- Never use `destructive` for merely "important" or "final" actions — reserve it for irreversible deletion; a Save button is `default`, not destructive.
- Never build a link out of `<Button asChild><a>` when the target is navigation — Base UI applies `role="button"`, clobbering link semantics. Use `buttonVariants()` on a plain `@/i18n/routing` link instead.
- Never ship an icon-only button (`size="icon"`) without an `aria-label` — the icon is `aria-hidden`, so it has no accessible name.
- Never remove `focus-visible:*` to "clean up" the outline — it's the only keyboard affordance.
- Never edit `button.tsx` for a one-off look — pass `className` (it wins via `cn()`) or add a `cva` case; never hard-code a hex/px.
- Never signal disabled/busy by opacity alone — pair with text, `aria-disabled`/`aria-busy`, or a spinner.
- Never inline the label string — it lives in `messages/<locale>.json`.

## Tokens

- **Color** — `bg-primary`/`text-primary-foreground` (primary → **brand** per `DESIGN.md`), `bg-secondary`, `bg-background` + `border-border`, `hover:bg-accent`/`text-accent-foreground`, `text-muted-foreground` for quiet labels; destructive → **error** role.
- **Radius** — `rounded-md` (0.5rem, default); `xs`/`icon-xs` stay `rounded-md`.
- **Elevation** — flat by default; `outline` carries `shadow-xs`. Buttons don't self-elevate beyond that (no raised/overlay shadow on a button).
- **Focus** — `focus-visible:ring-ring` at `ring-[3px]` + `border-ring`, `outline-none`.
- **Motion** — `transition-all` (≈160ms standard, ease-out); guard any spinner with `motion-reduce:animate-none`.
- **Icons** — Lucide, `size-4` (16px) via `[&_svg:not([class*='size-'])]:size-4`, `size-3` at `xs`; `aria-hidden` unless the sole label.

Sources:

- https://ui.shadcn.com/docs/components/button
- https://m3.material.io/components/all-buttons
- https://carbondesignsystem.com/components/button/usage/
- https://github.com/carbon-design-system/carbon-website/blob/main/src/pages/components/button/usage.mdx
