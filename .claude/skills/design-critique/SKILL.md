---
name: design-critique
description: Structured, ordered critique-then-fix of a built screen in this template — four focused passes (accessibility → visual hierarchy → content → interaction-states), one lens at a time, fixing before the next. Use when refining a screen, or when asked to "critique this screen", "design critique", "improve this UI", or "make this design better".
---

# Design critique (ordered)

The way to improve a built or AI-generated screen: **not one giant "what's wrong", but four focused
passes in a fixed order**, each critique-then-fix, one lens at a time. Order matters — **accessibility
is the foundation**, so it goes first; a later pass must never regress an earlier one (fix hierarchy
without breaking a11y, refine copy without breaking hierarchy). Authority for every pass:
`code/packages/shared/ui-tokens/DESIGN.md`.

This is the **refinement** loop (polishing one screen). For a fast PR read, run the reviewer agents in
**parallel** instead (design + a11y at once) — the two coexist, they do different jobs. Run this after
the pixels exist (`rules/visual-verification.md` — screenshot at
375 / 768 / 1280) so each pass interprets real frames.

## The four passes — in order, each: critique → fix one-by-one → re-screenshot → next

1. **Accessibility** (foundation first). Lens: contrast, touch targets ≥40px, focus order,
   `focus-visible` rings, semantic hierarchy, no state-by-colour-alone. Run the **`accessibility-pass`**
   skill / delegate to the **`accessibility-reviewer`** agent. Authority: DESIGN.md §Accessibility +
   `rules/accessibility.md`. Fix, `pnpm verify:contrast`, then move on — the accessible baseline is now
   fixed and later passes must not break it.
2. **Visual hierarchy** (functional, not pretty). Lens: does the type scale
   (`eyebrow → heading → … → caption`) match actual importance? One primary action per surface? Spacing
   rhythm, elevation restraint. Run **`visual-polish`** / **`ux-reviewer`** (+ **`design-system-check`**
   / **`design-system-reviewer`** for token + type-scale mapping). Authority: DESIGN.md §Typography +
   §Layout & Spacing. Fix hierarchy **without touching the a11y wins** from pass 1.
3. **Content / copy**. Lens: ambiguous, overly technical, too-long labels; does each label describe the
   _consequence_ of its action? Brand voice, one-term consistency, locale parity, strings in
   `messages/<locale>.json`. Delegate to the **`copy-reviewer`** agent. Authority: DESIGN.md §Product
   Content.
4. **Interaction-states** (last — the screen is now accessible, well-ordered, well-worded). Lens: hover,
   `focus-visible`, active/pressed, disabled, loading, empty, error, success, destructive-confirm — do
   they all exist and read right? Delegate to the **`interaction-states-reviewer`** agent. Authority:
   DESIGN.md §Interaction & States + §Required States. **Read the code** for states a screenshot can't
   show; render + screenshot the loading / empty / error frames.

Each pass: present findings in priority order, apply fixes **one at a time** (so each is reviewable),
re-screenshot the affected widths, then start the next pass. Never batch all four into one edit.

## Gate

Re-screenshot at **375 / 768 / 1280** after each pass's fixes and review the _images_ (per
`rules/visual-verification.md`). At the end: `pnpm verify:quick`, and `pnpm verify:contrast` if any
colour moved. Reuse the existing reviewer agents — this skill sequences them, it does not re-implement
their checks.
