---
name: visual-polish
description: Final visual-polish pass on a built UI in this template — rhythm, hierarchy, restraint, motion. Use when a screen works but needs to feel crafted, or when asked to "polish", "tighten the design", or "make it feel finished".
---

# Visual polish

The last pass before a UI is "done" — from correct to crafted. Authority:
`code/packages/ui-tokens/DESIGN.md` (Brand & Style: "restraint is the brand"). Pair with the
`frontend-design` skill for aesthetic direction.

## Checklist

1. **One signature moment** — each surface earns exactly one deliberate flourish
   (a pulsing status dot, an asymmetric lead), everything else quiet. Spend
   boldness once; if there are two, cut one.
2. **Spacing rhythm** — consistent section rhythm (`border-t py-16 md:py-24`),
   centered intro capped `max-w-2xl`, prose `max-w-3xl`. No ad-hoc margins.
3. **Hierarchy** — type scale matches importance; secondary text is
   `muted-foreground`; eyebrow encodes something, doesn't just decorate.
4. **Elevation** — flat by default; `ring-1 ring-border/60 shadow-sm` at rest,
   `hover:shadow-md`; real shadow only on overlays.
5. **Motion** — every transform guarded with `motion-reduce:`; subtle, purposeful.
6. **Restraint** — not every group needs a card; reach for spacing/heading/divider first.

## Gate

Verify at 375 / 768 / 1280, run `pnpm verify:quick`, and confirm nothing reads as
a templated default (that's the whole point). Delegate a perspective check to the
`ux-reviewer` agent if unsure.
