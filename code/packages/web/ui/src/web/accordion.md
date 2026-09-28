> shadcn `accordion` · `src/user-interface/ui/accordion.tsx`

**Use when** condensing related, secondary content (FAQs, spec panels) into collapsible sections to save vertical space. **Don't** use it to hide primary content, form steps, or anything the user must see — that belongs on the page or in Tabs/Stepper.

## Anatomy

- **Root** (`Accordion`) — container; owns `type` (`single` / `multiple`) and open state.
- **Item** (`AccordionItem`) — one collapsible section, `border-b` divider.
- **Header + Trigger** (`AccordionTrigger`) — full-width clickable row: **label** (left) + **chevron indicator** (right, rotates 180° when open).
- **Content** (`AccordionContent`) — the panel revealed on expand.

## Variants

| Variant                              | Use for                                                   | Base (Tailwind defaults + tokens)                                           |
| ------------------------------------ | --------------------------------------------------------- | --------------------------------------------------------------------------- |
| Single (`type="single" collapsible`) | FAQ, step-through where only one answer matters at a time | Root default; one item open, click-to-close all                             |
| Multiple (`type="multiple"`)         | Reference lists / spec panels users compare side by side  | `type="multiple"` on Root                                                   |
| Flat (default)                       | In-flow content, list-like                                | `border-b` between items, no container chrome                               |
| Card-wrapped                         | Standalone block that needs edge definition               | wrap items in `rounded-md ring-1 ring-border/60 shadow-sm` (card elevation) |

Pick single **or** multiple for a whole surface and stay consistent — don't mix per section.

## States

- **hover** — `hover:underline` on the trigger label (repo default). Whole row is the hit target.
- **focus-visible** — `focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring outline-none` (always on the trigger).
- **open** — `data-[state=open]` rotates the chevron (`[&[data-state=open]>svg]:rotate-180`); never signal open by color alone — the chevron carries it.
- **disabled** — `disabled:pointer-events-none disabled:opacity-50` on the item's trigger; pair with real disablement, not just dimming.

## Hierarchy

Secondary to the surrounding content — one accordion per section, ideally < 8 items; more than that wants search or pagination. Never the primary reading path.

## Restrictions

- Never **nest** accordions — flatten or split the surface instead.
- Never hide **critical / always-relevant** info (pricing, errors, legal, active form fields) behind a collapsed panel.
- Never wrap the trigger label in `next/link` or a button — the trigger is already the interactive element; put links inside `AccordionContent`.
- Never use it as **navigation** (use a nav menu) or as **Tabs** (mutually exclusive peers of equal weight → Tabs).
- Don't set the chevron as the only click target — the entire header row toggles.
- Keep the chevron `aria-hidden` (it is by default); the label is the accessible name.
- Don't animate with a custom duration — reuse the repo's `animate-accordion-up/down`.

## Tokens

- **Color** — `text-foreground` label, `text-muted-foreground` chevron, `border-border` (`border-b`) dividers, `bg-background` surface. No `bg-brand` — accordions are neutral.
- **Radius** — flat variant has none; card-wrapped uses `rounded-md` (0.5rem default).
- **Elevation** — flat by default; card-wrapped = card (`ring-1 ring-border/60 shadow-sm`).
- **Type** — trigger `text-sm font-medium` (title role), content `text-sm` body.
- **Focus** — `focus-visible:ring-ring` (always present, do not remove).
- **Motion** — `animate-accordion-up/down` + chevron `transition-transform duration-200`; ease-out; respect `motion-reduce:`.
- **Sizing** — trigger `py-4` (≥ 40px row), full-width hit target; chevron `size-4` (16px, compact).

Sources:

- https://www.radix-ui.com/primitives/docs/components/accordion
- https://ui.shadcn.com/docs/components/accordion
- https://carbondesignsystem.com/components/accordion/usage/
- https://mui.com/material-ui/react-accordion/
