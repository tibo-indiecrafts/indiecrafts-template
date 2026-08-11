# Hover card

> shadcn `hover-card` · `src/user-interface/ui/hover-card.tsx`

**Use when** a sighted mouse user should preview non-essential context behind a link (a person, a term, a linked page). **Don't** put essential info or any action inside it — keyboard and touch users never reach it.

## Anatomy

- `HoverCard` (root — owns `openDelay`/`closeDelay`)
- `HoverCardTrigger` (the link/element hovered — usually `asChild` on an `<a>`)
- `HoverCardContent` (portalled float: `bg-popover`, `rounded-md`, `border`, `shadow-md`, `p-4`, `w-64`) → your content: avatar, `title`, `caption`/`body`, meta row
- optional `HoverCardArrow` (visually tie content to trigger — off by default)

## Variants

| Variant           | Use for                                 | Base (Tailwind defaults + tokens)                                                                      |
| ----------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Profile preview   | @mention, author byline, avatar         | `w-64 p-4 bg-popover text-popover-foreground rounded-md border shadow-md`, `flex gap-4` avatar + stack |
| Term / definition | glossary term, footnote, inline concept | same shell, single `text-sm` (`body`) paragraph, `text-muted-foreground` for meta                      |
| Link preview      | outbound/internal page peek             | same shell, `title` line + `caption` domain/date + optional thumbnail                                  |

Vary content, not the shell — one padded popover surface. New width only via `className` on `HoverCardContent` (`w-72`/`w-80`), never a fork.

## States

- **open / closed** — Radix drives `data-[state=open]`/`closed`; keep the default `fade + zoom-95` enter/exit (`animate-in`/`animate-out`), guard with `motion-reduce:transition-none`.
- **hover (open trigger)** — opens after `openDelay` (~700ms); closes after `closeDelay` (~300ms). Never set either to `0` — instant open on pointer transit is jitter.
- **focus-visible** — the _trigger_ (a real link) still needs `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`. The card itself takes no focus.
- no disabled / loading / active / error state — it is a passive preview, not a control.

## Hierarchy

Enrichment layer, never the primary path — the trigger link must work fully without it. One open at a time; never nest hover cards or stack them over other overlays.

## Restrictions

- Never put buttons, links, forms, or anything clickable inside — hover cards are unreachable by keyboard/touch. Interactive content → `Popover` (click) instead.
- Never carry essential or sole-source information here — it is invisible to keyboard, screen-reader, and touch users (Radix: "sighted users only").
- Never use it as a tooltip — icon/label text uses `Tooltip` (plain, short, role="tooltip"). Hover card is the _rich_ preview, longer and structured.
- Never open on click or trigger a navigation from opening — hover only; the link navigates.
- Never set `openDelay={0}` or wire it to a `<button>` — trigger is a link/anchor.
- Never grow past ~`w-80` or dump paragraphs — a peek, not a page.

## Tokens

- Color: `bg-popover` / `text-popover-foreground` surface, `border-border`, meta in `text-muted-foreground`.
- Radius: `rounded-md` (default).
- Elevation: overlay-lite — `shadow-md` + `border` (float above content, below dialogs).
- Focus: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` on the trigger only.
- Motion: default `fade-0` + `zoom-95` enter (ease-out) / leave (ease-in), ~160ms; `motion-reduce:` disables.
- Type: `title` heading + `body`/`caption` inside; keep to two or three lines.

Sources:

- https://www.radix-ui.com/primitives/docs/components/hover-card
- https://ui.shadcn.com/docs/components/hover-card
- https://m3.material.io/components/tooltips/guidelines
