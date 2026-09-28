> shadcn `marker` · `src/user-interface/ui/marker.tsx`

**Use when** you need a subordinate, full-width label that annotates or breaks a stream of content — a date/status break in a thread, a section caption, an "OR" divider. **Don't** use it for interactive controls, headings, or body copy — it is a muted annotation, not primary content.

## Anatomy

- **Marker** (row) — full-width, `min-h-4`, `flex items-center gap-2`, muted small text; optional decorative rule(s).
- **MarkerIcon** — leading `size-4` icon slot, always `aria-hidden`.
- **MarkerContent** — the label text (or inline link); wraps and centers in `separator`.

## Variants

| Variant     | Use for                                                          | Base (Tailwind defaults + tokens)                                                        |
| ----------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `default`   | Left-aligned muted annotation in a list or feed                  | `flex items-center gap-2 text-sm text-muted-foreground text-left`                        |
| `separator` | Centered label straddling a horizontal rule ("OR", a date break) | adds `before:`/`after:` `h-px flex-1 bg-border`; content becomes `flex-none text-center` |
| `border`    | Label sitting above a hairline that closes a block               | `border-b border-border pb-2`                                                            |

## States

- **hover** (links only) — `[a]:hover:text-foreground`; the row itself is non-interactive and has no hover.
- **focus-visible** (links only) — inherit `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`; never leave an in-marker link unfocusable.
- No active / disabled / loading — Marker is presentational; it holds no control state.

## Hierarchy

Lowest-emphasis element in its container — always below the content it labels. One per logical break; never two markers in a row (a rule with nothing between reads as noise).

## Restrictions

- Never make the Marker itself clickable — wrap a real link/button in `MarkerContent` instead, or use a Button.
- Never stack consecutive markers or use one as a full-bleed page divider — use `Separator` for structural page splits; Marker is an inline-content annotation.
- Never pour a paragraph into `MarkerContent` — it is a short label; it truncates/wraps, it is not body copy.
- Never bump the type past `text-sm` or drop the muted color to "emphasize" it — that defeats its subordinate role; promote to a heading instead.
- Never signal state (new/error) by color alone — pair with an icon or text in `MarkerIcon`/`MarkerContent`.
- Never hardcode the rule color — the `before/after` lines and border must stay `bg-border` / `border-border`.

## Tokens

- **Color** — text `text-muted-foreground`; links resolve to `text-foreground` on hover; rules `bg-border` (separator) / `border-border` (border).
- **Type** — `text-sm`, caption/muted role; links `underline underline-offset-3`.
- **Icon** — Lucide `size-4` (16px), `aria-hidden`, `shrink-0`.
- **Radius / elevation** — none; Marker is flat by design.
- **Focus** — `focus-visible:ring-2 ring-ring` on any interactive child only.
- **Motion** — none on the row; a link color change may use the standard 160ms ease-out, `motion-reduce:transition-none`.

Sources:

- https://ant.design/components/divider
- https://www.radix-ui.com/primitives/docs/components/separator
- https://ui.shadcn.com/docs/components/separator
- https://m3.material.io/components/divider/guidelines
- https://carbondesignsystem.com/community/patterns/chatbot/flows/
