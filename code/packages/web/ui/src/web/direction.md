> shadcn `direction` · `src/user-interface/ui/direction.tsx`

**Use when** the app (or a subtree) must render right-to-left and every Radix primitive under it should flip in lockstep — set `dir` once at the layout root from the active locale. **Don't** reach for it to style layout or flip a single element; it renders no DOM and swaps no classes — it only broadcasts reading direction through context.

## Anatomy

- **Root** (`DirectionProvider`) — the only part. A headless context provider that renders **no element**, just its `children`. Accepts `dir` (aliased as `direction`) = `"ltr" | "rtl"`.
- **`useDirection()`** — the read side. A hook that returns the current `"ltr" | "rtl"` for components that must branch on direction.

## Variants

No visual variants — it emits no markup and owns no classes. The only axis is the `dir` value:

| Variant     | Use for                             | Base (Tailwind defaults + tokens)                                                                           |
| ----------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `dir="ltr"` | Latin/CJK locales — the default     | none — provider renders nothing; children carry all styling                                                 |
| `dir="rtl"` | Arabic, Hebrew, Farsi, Urdu locales | none — pair with `<html dir>` so CSS logical properties (`ps-*`, `pe-*`, `ms-*`, `me-*`, `text-start`) flip |

## States

The provider has no interactive states — it renders no interactive element and owns no focus, hover, or loading. Any such state belongs to the descendant components. Focus rings on those descendants stay `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` regardless of direction.

## Hierarchy

A single app-level wrapper, mounted once near the layout root (alongside the theme/intl providers) — not a per-page or per-section tool. There is at most one active direction per subtree; nesting a second provider to flip an isolated region is legal but rare.

## Restrictions

- Never expect it to render or style anything — no wrapper `<div>`, no class, no visual change. It is context only; if you want a box, use a real element.
- Never hard-code `dir="rtl"` — derive it from the active locale (`@/i18n/routing`), the same source that feeds `<html dir>`.
- Never use it as a substitute for `<html lang>`/`<html dir>` — set both; the provider syncs Radix primitives, the `<html>` attribute drives CSS logical properties and the browser.
- Never flip layout with direction-conditional margins/paddings; use logical utilities (`ms-*`/`me-*`/`ps-*`/`pe-*`, `text-start`/`text-end`) so one class works both ways.
- Never mount more than one at the root, and never place it below the components that need it — providers must wrap their consumers.
- Never read direction off `document.dir` in a component — call `useDirection()` so it stays reactive and SSR-safe.

## Tokens

None of its own — the provider is invisible and token-free. It governs how the design tokens _resolve_ directionally in descendants:

- **Color / radius / elevation** — unchanged; inherited from whatever component the provider wraps.
- **Focus** — descendants keep `focus-visible:ring-2 ring-ring`; direction never alters the ring.
- **Motion** — none; swapping `dir` is not an animated transition.
- **Spacing** — no token, but the reason it exists: RTL correctness depends on logical spacing utilities (`ms/me`, `ps/pe`) over physical `ml/mr`, `pl/pr`.

Sources:

- https://www.radix-ui.com/primitives/docs/utilities/direction-provider
- https://ui.shadcn.com/docs/components/sidebar
