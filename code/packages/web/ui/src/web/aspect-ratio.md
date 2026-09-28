> shadcn `aspect-ratio` · `src/user-interface/ui/aspect-ratio.tsx`

**Use when** you must lock a media box (image, video, embed, map) to a fixed proportion so it never reflows as content or viewport changes. **Don't** use it to size text blocks, cards, or anything whose height should follow its content — let the content flow.

## Anatomy

- **Root** (`AspectRatio`) — the only part. A ratio-constrained box (`padding-bottom` trick under the hood).
- **Single child** — the media you constrain (`<Image>`, `<video>`, `<iframe>`), stretched to fill.

## Variants

No visual variants — it is a layout primitive with a single `ratio` prop (number, e.g. `16 / 9`). The styling lives on the child, not the Root. Common ratios:

| Ratio    | Use for                             | Child base (Tailwind defaults + tokens) |
| -------- | ----------------------------------- | --------------------------------------- |
| `16 / 9` | Video, hero media, embeds (default) | `h-full w-full rounded-md object-cover` |
| `4 / 3`  | Photo thumbnails, cards             | `h-full w-full rounded-md object-cover` |
| `1 / 1`  | Avatars, gallery tiles, square art  | `h-full w-full rounded-md object-cover` |
| `9 / 16` | Portrait / mobile-shot media        | `h-full w-full rounded-md object-cover` |

## States

The primitive has no interactive states — it renders no interactive element and owns no focus. Any hover/focus/loading behavior belongs to the child:

- **loading** — child image gets a placeholder: `bg-muted animate-pulse` (guard with `motion-reduce:animate-none`) until loaded.
- **focus-visible** — only if the child (or its wrapper link) is interactive: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` on that element, never on the Root.

## Hierarchy

A structural wrapper, not a visible surface — it sits beneath the media and is invisible itself. Use freely wherever media needs a stable box; there is no "one per view" limit.

## Restrictions

- Never put text or a card body inside it — the fixed ratio will clip or stretch flowing content. Media only.
- Never omit `object-cover` (or `object-contain`) on the child image — without it the image distorts to fill the box.
- Never set `width`/`height` on the child; use `h-full w-full` and let the Root drive size.
- Never add `rounded-*` to the Root expecting clipped corners — round the child (and add `overflow-hidden` on the Root only if the child bleeds).
- Never wrap it in a fixed-height parent — its height is derived from width × ratio; a competing fixed height breaks the constraint.
- Never reach for it just to "size a box" — plain Tailwind spacing/`aspect-*` utilities cover non-media cases with less markup.

## Tokens

- **Radius** — `rounded-md` (0.5rem default) on the child; match the surrounding card's radius.
- **Color** — loading placeholder `bg-muted`; no border of its own (the child or parent card owns `border-border`).
- **Elevation** — none; inherits the parent surface's elevation (card = `ring-1 ring-border/60 shadow-sm`).
- **Motion** — only via a child placeholder `animate-pulse`, guarded `motion-reduce:animate-none`.
- **Focus** — none on the Root; `focus-visible:ring-2 ring-ring` lives on an interactive child only.

Sources:

- https://ui.shadcn.com/docs/components/aspect-ratio
- https://www.radix-ui.com/primitives/docs/components/aspect-ratio
