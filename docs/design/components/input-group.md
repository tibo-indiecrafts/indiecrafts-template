# Input group

> shadcn `input-group` · `src/user-interface/ui/input-group.tsx`

**Use when** an input needs an inline affix — icon, unit, currency, prefix/suffix text, or an action button that belongs _to_ the field. **Don't** use it to lay out separate fields side by side, or as a substitute for a `<label>`.

## Anatomy

- `InputGroup` — the bordered container (`role="group"`), owns the focus ring and error state.
- `InputGroupAddon` — affix slot; positioned by `align`, **always placed after the control in the DOM**.
- `InputGroupInput` / `InputGroupTextarea` — the borderless control (`data-slot="input-group-control"`).
- Inside an addon: `InputGroupText` (units, `$`, `.com`), `InputGroupButton` (submit, clear, reveal), a Lucide icon, or a `Kbd`.

## Variants

Addon position is the only visual axis — set via the `align` prop on `InputGroupAddon`.

| Variant                  | Use for                                         | Base (Tailwind defaults + tokens)       |
| ------------------------ | ----------------------------------------------- | --------------------------------------- |
| `inline-start` (default) | leading icon, currency `$`, protocol `https://` | `order-first pl-3`, control gets `pl-2` |
| `inline-end`             | trailing unit `kg`, submit/clear button, `Kbd`  | `order-last pr-3`, control gets `pr-2`  |
| `block-start`            | label row or toolbar above a `Textarea`         | `flex-col`, full-width `px-3 pt-3`      |
| `block-end`              | char counter or actions below a `Textarea`      | `flex-col`, full-width `px-3 pb-3`      |

`InputGroupButton` sizes: `xs` (default), `sm`, `icon-xs`, `icon-sm`; default `variant="ghost"`, `type="button"`.

## Sizes

The group is fixed at `h-9` (textarea auto-grows). No size axis on the group itself; scale the control via context, not a prop.

## States

- **hover** — no distinct style; the whole group is `cursor-text` and clicking any addon focuses the control.
- **focus-visible** — ring lives on the _group_, not the input: `has-[…:focus-visible]:border-ring` + `ring-ring/50 ring-[3px]`. The inner control has its own ring removed (`focus-visible:ring-0`).
- **disabled** — set `disabled` on the control; addons dim via `group-data-[disabled=true]/input-group:opacity-50`.
- **error** — set `aria-invalid` on the control; group flips to `border-destructive` + `ring-destructive/20`. Pair with a visible message — never color alone.
- **loading** — swap the addon's icon/button content for a spinner; the group has no built-in loading state.

## Hierarchy

One control per group. Sits at the same level as a plain `Input` in a form — reach for it only when the field genuinely needs an affix; a bare `Input` is the default.

## Restrictions

- Never render `InputGroupAddon` before `InputGroupInput` in the JSX — DOM order is control-first; `align` does the visual placement. Reversing it breaks the click-to-focus and focus ring.
- Never use `Input`/`Textarea` inside the group — use `InputGroupInput`/`InputGroupTextarea` (they strip the border/ring so the group owns them). Double borders otherwise.
- Never let a prefix/suffix replace the label: addons are `aria-hidden`. A `$` prefix needs a label like "Amount in USD"; a `kg` suffix needs "Weight in kilograms".
- Never use an affix when the answer could be free text (a `$` on "What's a fair resolution?" is wrong) or when the meaning needs more than a short, commonly understood symbol/abbreviation.
- Never put the focus ring on the inner input — it belongs on the group.
- Icons are `aria-hidden` unless the sole label; use Lucide at the addon's default `size-4`.

## Tokens

- **Color** — border `border-input`; text `text-muted-foreground` (addons/text); error `border-destructive` + `ring-destructive/20`.
- **Radius** — `rounded-md` (group); nested `Kbd`/`xs` button use `rounded-[calc(var(--radius)-5px)]`.
- **Elevation** — flat with `shadow-xs` hairline (input convention, not a card).
- **Focus** — `focus-visible:ring-ring` at `ring-[3px]` on the group; `focus-visible:ring-0` on the control.
- **Motion** — `transition-[color,box-shadow]`, standard ~160ms ease-out; guard bespoke animation with `motion-reduce:`.
- **Type** — `text-sm` for addon text/buttons.

Sources:

- https://ui.shadcn.com/docs/components/input-group
- https://designsystem.digital.gov/components/input-prefix-suffix/
