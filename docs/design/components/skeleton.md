# Skeleton

> shadcn `skeleton` · `src/user-interface/ui/skeleton.tsx`

**Use when** content is loading and you can mirror its final shape/size to reduce layout shift. **Don't** use for sub-300ms loads, indeterminate background work, or as empty-state art — reach for a spinner or an empty state instead.

## Anatomy

- One or more placeholder blocks, each a `<div>` sized to the element it stands in for (line, avatar, thumbnail, button).
- Compose several blocks to mirror the real layout (e.g. circle avatar + two text lines for a list row). There are no sub-parts — a skeleton is just a sized, pulsing box.

## Variants

The primitive has no `variant` prop — you shape it per use via `className`. Standardize on these three shapes:

| Variant   | Use for                            | Base (Tailwind defaults + tokens)                                  |
| --------- | ---------------------------------- | ------------------------------------------------------------------ |
| Text line | Headings, body copy, labels        | `bg-muted animate-pulse rounded-sm h-4 w-full` (last line `w-2/3`) |
| Block     | Cards, thumbnails, images, buttons | `bg-muted animate-pulse rounded-md h-32 w-full`                    |
| Avatar    | Circular avatars / icons           | `bg-muted animate-pulse rounded-full size-10`                      |

Note: the shipped file defaults to `bg-accent`; override to `bg-muted` for the neutral placeholder tone, or leave `bg-accent` if the surface already sits on `muted`.

## Sizes

No size axis — height/width come from the content it replaces. Match the real element's box (a text-line skeleton is `h-4`, matching `body`; an avatar skeleton matches the avatar's `size-*`).

## States

Skeleton is non-interactive and has no hover/focus/active/disabled states.

- **loading** — the only state: `animate-pulse` signals in-progress. Swap the skeleton for real content the instant data arrives.
- **error** — never render a skeleton on error; show the error/empty state instead. A skeleton that never resolves reads as a hang.

## Hierarchy

Sits in place of the content it previews — same grid cell, same footprint. Group several to preview one region; don't scatter unrelated skeletons across the whole viewport.

## Restrictions

- Never leave a skeleton on screen indefinitely — it must resolve to content or an error, or it looks broken.
- Never wrap interactive attributes (`onClick`, `role`, `tabIndex`, focus ring) onto it — it is decorative; keep it out of the tab order.
- Never let skeleton dimensions differ from the real content's — mismatched sizes cause layout shift, defeating the purpose.
- Never animate faster/slower than the default pulse or add a custom shimmer — `animate-pulse` is the standard and respects `motion-reduce` via Tailwind.
- Never use for fast/quick transitions or as a permanent placeholder for content that doesn't exist yet — use an empty state.
- Never add `aria-label` text; instead mark the loading region with `aria-busy="true"` on the container and remove it when loaded.

## Tokens

- **Color:** `bg-muted` (placeholder fill; `bg-accent` is the file default). No text/border/brand color.
- **Radius:** `rounded-sm` text · `rounded-md` blocks · `rounded-full` avatars — match the real element's radius.
- **Elevation:** flat — no ring/shadow; the skeleton lives inside the card, it isn't a card.
- **Motion:** `animate-pulse` only (Tailwind default, honors `prefers-reduced-motion`). No custom duration.
- **Focus:** none — non-interactive, never in the tab order.

Sources:

- https://ui.shadcn.com/docs/components/skeleton
- https://ant.design/components/skeleton
