# Resizable

> shadcn `resizable` · `src/user-interface/ui/resizable.tsx`

**Use when** users need to persistently redistribute space between two or more side-by-side regions (editor + preview, list + detail, sidebar + canvas). **Don't** use it to show/hide content (that's `Collapsible`/`Sheet`/`Drawer`), for responsive breakpoint reflow, or for a single-region layout.

## Anatomy

- `ResizablePanelGroup` — container that owns the axis (`direction="horizontal"` default, or `"vertical"`).
- `ResizablePanel` — a content region with size constraints. Panels and handles must alternate as **direct children** — no wrapper `div`s between them.
- `ResizableHandle` — the focusable window-splitter separator between two panels. Optional `withHandle` renders a visible grip (`GripVerticalIcon`) so first-time users see it's draggable.

## Variants

| Variant               | Use for                                          | Base (Tailwind defaults + tokens)                                     |
| --------------------- | ------------------------------------------------ | --------------------------------------------------------------------- |
| Bare handle (default) | Dense/pro layouts where the seam is enough       | 1px `bg-border` divider, wide invisible `after:` hit-area             |
| `withHandle`          | First-run / consumer UIs needing an obvious grip | grip pill: `rounded-sm border bg-border`, `GripVerticalIcon size-2.5` |
| Horizontal group      | Side-by-side panes (default)                     | `flex` row, `w-px` handle                                             |
| Vertical group        | Stacked panes                                    | `flex-col` group, `h-px` full-width handle                            |
| Collapsible panel     | Pane that snaps to a rail below its min          | `collapsible` + `collapsedSize` on the `ResizablePanel`               |

## States

- **hover** — divider may lighten to signal draggability; keep the thin `bg-border` seam, never widen the _visible_ line.
- **focus-visible** — `focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-hidden` (handle is a real tab stop / ARIA window splitter).
- **active (dragging)** — cursor is `col-resize`/`row-resize`; pair any color change with the motion of the pane, never color alone.
- **disabled** — set `disabled` on the handle: removed from tab order, faded; pane sizes lock.
- No loading/error states — this is a layout primitive.

## Hierarchy

One `ResizablePanelGroup` owns a view region; keep nesting shallow (a horizontal group holding one vertical group is the practical ceiling). It's structural chrome, not a content block — at most one per major region.

## Restrictions

- Never wrap panels or handles in extra elements — `react-resizable-panels` requires them as direct alternating children or layout breaks.
- Never size in px — all of `defaultSize`/`minSize`/`maxSize`/`collapsedSize` are **percentages** of the group's axis.
- Never omit `minSize` on a panel that holds real content — without it a pane drags to 0 and vanishes.
- Never use it on mobile / narrow viewports — stack the regions instead; dragging a 375px screen into two panes is unusable.
- Never fatten the visible divider to make it easier to grab — keep the seam at `w-px`/`h-px` and let the invisible `after:` pseudo-element carry the ≥44px pointer target.
- Never repurpose it as a disclosure/accordion — reach for `Collapsible`, `Sheet`, or `Drawer`.
- Don't hand-roll drag/keyboard logic — the primitive already ships the ARIA window-splitter pattern (Arrow = step, Shift+Arrow = large step, Home/End = bounds, Enter = toggle collapsible).
- Persist layout with `autoSaveId` on the group rather than tracking sizes in your own state.

## Tokens

- **Color** — divider + grip `bg-border`; grip border from `border-border`; icon inherits `text-foreground`. No brand/error color here.
- **Radius** — grip pill `rounded-sm` (0.375rem).
- **Elevation** — flat; the seam is a `border` hairline, no shadow.
- **Focus** — `focus-visible:ring-1 ring-ring ring-offset-1` (thin ring; it's a hairline control, not a button).
- **Icon** — Lucide `GripVerticalIcon` at `size-2.5`, `aria-hidden`.
- **Motion** — none by default; dragging tracks the pointer 1:1. If you animate a collapse, keep it ≤240ms ease-out and guard with `motion-reduce:`.
- **Sizing** — visible seam `w-px`/`h-px`; pointer hit-area widened via `after:` to meet the ≥44px touch target.

Sources:

- https://ui.shadcn.com/docs/components/resizable
- https://nordhealth.design/components/resizable/
- https://www.telerik.com/design-system/docs/components/splitter/
