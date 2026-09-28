> shadcn `native-select` · `src/user-interface/ui/native-select.tsx`

**Use when** picking one option from a single, ordered list (5+ items, or long enough that radios would crowd the layout) — sorting, filtering, country/quantity/level pickers. **Don't** use for 2–4 unordered options (radios), yes/no (switch/checkbox), multi-select, or free text with suggestions (combobox).

## Anatomy

- **Label** — external, above the control (owned by the form `Field`, not this component). Always present; never a placeholder-as-label.
- **Select control** — native `<select>`, the full-width hit target.
- **Value / placeholder** — the selected `<option>` text, or a disabled first `<option value="">` acting as placeholder (`text-muted-foreground`).
- **Trailing chevron** — `ChevronDownIcon`, `size-4`, `text-muted-foreground`, `pointer-events-none`, `aria-hidden`. Decorative; the native control owns the interaction.
- **Options / groups** — `NativeSelectOption` / `NativeSelectOptGroup`; rendered by the OS, so `bg-[Canvas]`/`text-[CanvasText]` (system colors), not app tokens.

## Variants

This component has **no visual variants** — one look, driven by state. (Error is a state via `aria-invalid`, not a variant.) Do not fork it into "primary/secondary" selects.

| Variant | Use for      | Base (Tailwind defaults + tokens)                                                                                    |
| ------- | ------------ | -------------------------------------------------------------------------------------------------------------------- |
| default | every select | `rounded-md border border-input bg-transparent shadow-xs` · chevron `text-muted-foreground` · `appearance-none pr-9` |

## Sizes

| Size      | Height | Padding          | Text      |
| --------- | ------ | ---------------- | --------- |
| `default` | `h-9`  | `px-3 py-2 pr-9` | `text-sm` |
| `sm`      | `h-8`  | `px-3 py-1 pr-9` | `text-sm` |

Both defaults sit below the repo's 40px desktop / 44px touch control token. On touch-facing forms bump to `h-10`+ (see Restrictions) — the `size` prop only toggles `sm`/`default`.

## States

- **hover** — no light-mode change (border stays `border-input`); dark mode lifts the fill (`dark:hover:bg-input/50`). Don't add a light hover unless a token calls for it.
- **focus-visible** — `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]` + `outline-none`. Always on; never strip it.
- **active / open** — the native picker is OS-drawn; there is no app-styled open state to build.
- **disabled** — wrapper `has-[select:disabled]:opacity-50`; control `disabled:cursor-not-allowed disabled:pointer-events-none`. Use the native `disabled` attribute, not a class.
- **error** — set `aria-invalid` on the select: `aria-invalid:border-destructive aria-invalid:ring-destructive/20`. Pair with visible helper text — never signal error by border color alone.
- **loading** — native `<select>` has none. Disable the control and show status elsewhere; don't fake a spinner inside it.

## Hierarchy

An input-level control, peer to `Input`/`Textarea` inside a form `Field`; several per form is fine. It is never a primary action — no `bg-brand`. If the choice is the page's main action, that's a button, not a select.

## Restrictions

- Never rebuild this as a custom div/listbox dropdown — the native element is the accessible, mobile-correct baseline; a hand-rolled one loses screen-reader semantics and the OS picker.
- Never use it for 2–4 unordered options — that's radio buttons; native select for ordered/long lists only.
- Never style `<option>`/`<optgroup>` with app tokens (`bg-background`, `text-foreground`) — the OS renders them; keep `bg-[Canvas]`/`text-[CanvasText]`.
- Never drop `appearance-none` or the `pr-9` padding — that reintroduces the native arrow, doubling it with the chevron.
- Never use a placeholder `<option>` as the accessible label — always a real `<label>`; the placeholder option must be `disabled` so it can't be re-selected.
- Never signal error with `aria-invalid` styling alone — add helper text.
- Never ship it below the touch target on touch forms — raise the height; don't rely on the `sm` size for dense mobile layouts.
- Never add a `size` value beyond `sm`/`default` — extend the prop union, don't pass raw height classes ad hoc.

## Tokens

- **Color** — `border-input`, `bg-transparent`, chevron `text-muted-foreground`, placeholder `text-muted-foreground`; error via `destructive` (`aria-invalid:border-destructive` / `ring-destructive/20`, dark `/40`). Options use system `Canvas`/`CanvasText`. No `brand`.
- **Radius** — `rounded-md` (0.5rem, default).
- **Elevation** — `shadow-xs` (near-flat control), not `card`/`raised`.
- **Focus** — `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none`.
- **Motion** — `transition-[color,box-shadow]` only (border/ring fade). Standard ≤160ms, `motion-reduce:` respected by the token layer.
- **Icon** — Lucide `ChevronDownIcon`, `size-4` (16px, compact), `aria-hidden`.

Sources:

- https://ui.shadcn.com/docs/components/select
- https://css-tricks.com/striking-a-balance-between-native-and-custom-select-elements/
- https://www.atomica11y.com/accessible-design/select/
- https://atlassian.design/components/select/usage
