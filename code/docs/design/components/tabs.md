# Tabs

> shadcn `tabs` · `src/user-interface/ui/tabs.tsx`

**Use when** switching between peer views of the _same_ context without leaving the page (e.g. Overview / Specs / Reviews). **Don't** use for sequential steps, primary site navigation, or content that must be read in order — use a stepper, the header nav, or stacked sections instead.

## Anatomy

- `Tabs` — root, owns `value` + `orientation` (horizontal default / vertical).
- `TabsList` — the tab strip (one active indicator lives here).
- `TabsTrigger` — one per view: optional Lucide icon + label; exactly one is `data-state=active`.
- `TabsContent` — the panel shown for the active trigger.

## Variants

| Variant   | Use for                                               | Base (Tailwind defaults + tokens)                                                                                  |
| --------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `default` | Emphasized, self-contained switch inside a card/panel | List `bg-muted rounded-lg p-[3px]`; active trigger `bg-background text-foreground shadow-sm` (raised pill)         |
| `line`    | Page-level or in-header tabs, quieter, more tabs      | List `bg-transparent`; active trigger underline via `after:bg-foreground` (2px), `text-foreground`, no fill/shadow |

Orientation is a separate axis: `orientation="vertical"` stacks the list to the side (indicator moves to the right edge). Default is horizontal.

## Sizes

Single size. `TabsList` is `h-9`, triggers are `text-sm font-medium`, icons `size-4`. No size variant exists — do not invent `sm`/`lg`; if a larger target is needed on touch, gate spacing with `sm:` rather than forking the component.

## States

- **hover** — `text-foreground/60 → hover:text-foreground` (color shift only; container unchanged).
- **focus-visible** — `focus-visible:ring-ring/50 ring-[3px]` + `border-ring` (always present, keyboard-only).
- **active/selected** — `data-[state=active]`: `default` gets `bg-background` + `shadow-sm`; `line` gets the `after:` underline at `opacity-100`. Exactly one active at all times.
- **disabled** — `disabled:opacity-50 disabled:pointer-events-none` on the trigger; keep the tab present, don't remove it.
- No loading or error state — the panel owns async/error UI, not the trigger.

## Hierarchy

One tab set per view region; place it directly above its panel. Sits _below_ the page header/nav — tabs switch content, they don't navigate the site. Never nest a second tab strip inside a tab panel.

## Restrictions

- Never signal the active tab by color alone — the fill/shadow (`default`) or underline (`line`) carries it; keep them.
- Never use tabs for ordered/sequential flows or as primary navigation — Radix tabs render all panels' mount but show one; they are not routes.
- Never wrap the list onto two rows or truncate labels — keep 2–5 short labels; if they overflow, switch to `line` (scrollable) or fewer tabs.
- Never route with `TabsTrigger` — it's a button, not a link; for URL-driven views use `@/i18n/routing` links, not tabs.
- Never edit `tabs.tsx` to add a size/color — extend via `className` (merged with `cn()`, yours wins) or a new `cva` case.
- Never hardcode the underline/fill color — it's `after:bg-foreground` / `bg-background`, both tokens.
- Icons are decorative here: `aria-hidden` (Radix already labels the trigger by its text).

## Tokens

- **Color** — `bg-muted` (list track), `bg-background` + `text-foreground` (active), `text-foreground/60` / `text-muted-foreground` (idle), `after:bg-foreground` (line underline), `border-ring`/`ring-ring` (focus).
- **Radius** — list `rounded-lg`, trigger `rounded-md`; `line` variant forces `rounded-none`.
- **Elevation** — active `default` trigger uses `shadow-sm` (card-tier lift on the muted track); `line` stays flat.
- **Focus** — `focus-visible:ring-ring/50 ring-[3px]` + `outline-ring` (never removed).
- **Motion** — `transition-all` on triggers, `after:transition-opacity` on the underline; standard ~160ms ease. Guard any added movement with `motion-reduce:`.

Sources:

- https://m3.material.io/components/tabs/guidelines (Material 3 — primary vs secondary, group-not-sequence, active indicator = underline + color)
- https://carbondesignsystem.com/components/tabs/usage/ (Carbon — contained vs line, no truncation / scroll on overflow)
- https://developer.apple.com/design/human-interface-guidelines/tab-bars (Apple HIG — 2–5 peers, don't nest, don't use for modal/temporary tasks)
- https://ui.shadcn.com/docs/components/tabs (shadcn — component API this file wraps)
