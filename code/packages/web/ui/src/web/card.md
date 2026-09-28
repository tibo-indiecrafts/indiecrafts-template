> shadcn `card` · `src/user-interface/ui/card.tsx`

**Use when** grouping content about a **single subject** into a bounded, self-contained surface. **Don't** use it as a page layout wrapper, to nest cards inside cards, or to fake a button/link.

## Anatomy

- **Container** — `bg-card` surface, border, radius, vertical padding.
- **Header** (`CardHeader`) — grid of:
  - **Title** (`CardTitle`) — the subject, one line, `font-semibold`.
  - **Description** (`CardDescription`) — supporting text, `text-muted-foreground text-sm`.
  - **Action** (`CardAction`) — optional top-right slot (badge, icon button, menu).
- **Media** (optional) — cover image/illustration, edge-to-edge via negative margin.
- **Content** (`CardContent`) — the body: text, lists, fields, stats.
- **Footer** (`CardFooter`) — optional trailing actions or metadata.

## Variants

Not a `cva` axis in this repo — compose with token classes. Cross-system consensus (Material 3, Carbon, Ant) is three emphasis levels:

| Variant                 | Use for                                 | Base (Tailwind defaults + tokens)        |
| ----------------------- | --------------------------------------- | ---------------------------------------- |
| Outlined                | Neutral default, dense lists of peers   | `bg-card border rounded-xl` (no shadow)  |
| Elevated (repo default) | A card that should lift off the page    | `bg-card border rounded-xl shadow-sm`    |
| Filled                  | Low-emphasis grouping, least separation | `bg-muted rounded-xl` (no border/shadow) |

Pick **one** emphasis level per group — mixing outlined and elevated peers reads as noise.

## Sizes

| Size           | Padding                                      | Text                              |
| -------------- | -------------------------------------------- | --------------------------------- |
| Default        | `py-6` container · `px-6` sections · `gap-6` | title `text-base`, desc `text-sm` |
| Compact (`sm`) | `py-4` · `px-4` · `gap-4`                    | title `text-sm`, desc `text-xs`   |

Drive spacing through the `--card-spacing` variable, not per-child overrides.

## States

A plain card is **static** — it has no states. States apply only when the _whole card_ is made interactive (a `clickable` card that navigates):

- **hover** — `hover:bg-accent hover:shadow-md`, `transition-shadow duration-160 ease-out motion-reduce:transition-none`.
- **focus-visible** — `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` on the card's link/button element (never a bare `div`).
- **active** — subtle `active:shadow-sm` press; no color-only signal.
- **selectable** — pair the visual with a real `role="checkbox"`/radio + checked icon; add a `border` so the card reads as operable (never rely on shadow/fill alone).
- **loading** — swap body for skeleton (`bg-muted animate-pulse`), keep the card's footprint stable.
- **disabled** — `opacity-50 pointer-events-none`, and disable the underlying control.

## Hierarchy

A section-level surface: sits **below** the page and **above** its own content. Show peers as a uniform grid of same-variant cards; never nest a card inside a card, and never make a card the top-level page frame.

## Restrictions

- Never wrap the whole card in `next/link` or an `onClick` `div` — for a clickable card, render one real `<a>`/`<button>` (`@/i18n/routing` for links) so it's keyboard-focusable, and keep a single primary target.
- Never nest cards — flatten, or use a divider/`bg-muted` region instead.
- Never signal interactivity or selection by elevation/color alone — add a border, icon, or text.
- Never put two competing primary actions in one card — one `bg-brand` action max; extras are `variant="outline"`/`ghost`.
- Never hard-code the surface — use `bg-card`/`bg-muted`, never a raw hex or `bg-white`; it must flip in dark mode.
- Never let a `CardTitle` render as an `<h1>`-through-`<h6>` by accident — it's a `div`; add the right heading semantics when the card is a landmark.
- Never stretch a card to page width for a single paragraph — that's a section, not a card.

## Tokens

- **Color:** `bg-card` / `text-card-foreground` (surface), `bg-muted` (filled), `text-muted-foreground` (description), `border-border`. Primary action inside = `bg-brand`/`text-brand-foreground`; destructive = error only.
- **Radius:** `rounded-xl` (1rem, shadcn card default); `rounded-lg` for compact.
- **Elevation:** flat `border` only → `card` `shadow-sm` (default) → `raised` `shadow-md` (hover). Reserve `shadow-lg` for dialogs, not cards.
- **Focus:** `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` — on the interactive element only.
- **Motion:** `duration-160 ease-out` on shadow/bg transitions; `motion-reduce:transition-none`.

Sources:

- https://ui.shadcn.com/docs/components/card
- https://m3.material.io/components/cards/specs
- https://carbondesignsystem.com/components/tile/usage/
- https://ant.design/components/card
