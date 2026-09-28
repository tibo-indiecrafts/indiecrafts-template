> shadcn `form` · `src/user-interface/ui/form.tsx`

**Use when** collecting structured user input (auth, contact, checkout, settings) that needs labels, validation, and error messaging wired together. **Don't** use it for a single free-standing control, a search box, or read-only data — a bare `Input`/`Label` or a definition list is enough.

## Anatomy

- `Form` — `FormProvider` context wrapper (holds react-hook-form state); one per `<form>`.
- `FormField` — binds one control to a field name via `Controller`; renders no DOM itself.
- `FormItem` — the field row (`grid gap-2`); owns the generated `id` that ties label → control → description → message.
- `FormLabel` — the visible `<label>`, auto-`htmlFor` the control; turns `text-destructive` on error.
- `FormControl` — `Slot` around the actual input; wires `id`, `aria-describedby`, `aria-invalid`.
- `FormDescription` — optional helper/hint text above or below the control (`text-muted-foreground`).
- `FormMessage` — validation error; renders nothing when there's no error.
- Submit button (`bg-brand` primary) at the end.

## Variants

| Variant           | Use for                                          | Base (Tailwind defaults + tokens)                                               |
| ----------------- | ------------------------------------------------ | ------------------------------------------------------------------------------- |
| Stacked (default) | Almost every form; all viewports                 | `FormItem` = `grid gap-2`, fields in a parent `grid gap-6`; label above control |
| Two-column grid   | Dense desktop forms (name + surname, city + zip) | wrap pairs in `grid grid-cols-1 sm:grid-cols-2 gap-4`; never below `sm`         |
| Grouped fieldset  | Related controls (address, radio/checkbox sets)  | wrap in `<fieldset>` + `<legend>`; keep `gap-6` between groups                  |

## States

- **focus-visible** — on the control, not the wrapper: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`.
- **disabled** — `disabled` on the control; `opacity-50 cursor-not-allowed pointer-events-none` (inherited from the primitive). Never gray the label alone.
- **loading** (submitting) — disable the submit button + show a spinner; keep fields enabled unless the whole form is pending.
- **error** — set by react-hook-form: `FormLabel` → `text-destructive`, control → `aria-invalid`, `FormMessage` shows the message. Pair the color with the text message + `aria-invalid` — never color alone.

## Hierarchy

One `<form>` owns one `Form` provider and one primary submit (`bg-brand`); everything else is secondary/ghost. Group long forms into fieldsets rather than nesting forms.

## Restrictions

- Never nest `<form>` elements or render two `Form` providers in one form.
- Never place a control outside `FormControl` — you lose the `id`/`aria-describedby`/`aria-invalid` wiring and break screen readers.
- Never hand-write `htmlFor`/`id` on `FormLabel`/control — `FormItem` generates them; hardcoding breaks the association.
- Never inline the error string — `FormMessage` pulls it from field state; passing children fights react-hook-form.
- Never put helper text and error in the same node — `FormDescription` (hint) and `FormMessage` (error) are separate slots.
- Never hardcode `text-red-500` for errors — use the `destructive` token (`error` role); never signal invalid by color alone.
- Never inline label/placeholder/error copy — all strings live in `messages/<locale>.json`.
- Never disable the submit until "valid" as the only feedback — show `FormMessage` errors so the user knows why.
- Never mark required fields with color alone — use a text/`*` marker with an accessible label, or mark the optional ones instead.

## Tokens

- **Color** — labels `text-foreground`; hints/description `text-muted-foreground`; errors `text-destructive` (error role); primary submit `bg-brand text-brand-foreground`; inputs `border-border bg-background`.
- **Radius** — controls `rounded-md` (default); match the `Input`/`Button` primitives.
- **Elevation** — flat inside page flow; `card` (`ring-1 ring-border/60 shadow-sm`) only if the form sits in a standalone card.
- **Type** — label/control `body` (`text-sm`); description + message `caption` (`text-sm text-muted-foreground` / `text-destructive`).
- **Focus** — `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` on every control.
- **Motion** — error/hint appearance ≤160ms `ease-out`; guard with `motion-reduce:transition-none`.
- **Sizing** — control height 40px desktop / 44px touch, 16px horizontal padding; touch targets ≥40px.

Sources:

- https://ui.shadcn.com/docs/forms/react-hook-form
- https://m3.material.io/components/text-fields/guidelines
- https://www.w3.org/WAI/tutorials/forms/
