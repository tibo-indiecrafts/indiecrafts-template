# Design critique — the ordered pass

How to improve a built (or AI-generated) screen: **not one giant "review this and tell me what's
wrong", but four focused passes in a fixed order**, each critique-then-fix, one lens at a time. This is
the interpretive layer on top of [visual verification](./adaptive-responsive) — that loop produces the
375 / 768 / 1280 screenshots; this one reads them across four lenses and fixes what it finds.

## Why ordered

Each pass builds on the previous, so a later fix must never regress an earlier one:

1. **Accessibility** — the foundation. An accessible baseline is the ground everything else stands on,
   so it goes first and stays fixed.
2. **Visual hierarchy** — arrange importance, without breaking the a11y wins.
3. **Content** — sharpen the words, without breaking the hierarchy.
4. **Interaction-states** — last, once the screen is accessible, well-ordered, and well-worded.

Fixing all four at once means a hierarchy tweak silently lowers a contrast ratio, or a copy edit
overflows a button. One lens at a time, re-screenshot between passes, keeps every gain.

## The four passes

Each pass has a reviewer and a `DESIGN.md` section as its authority. The `design-critique` skill runs
the loop and sequences these — you can also invoke a single pass directly.

| #   | Lens               | Reviewer                                                                           | Authority (`DESIGN.md`)                 | Ready prompt                                                                                                                         |
| --- | ------------------ | ---------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Accessibility      | `accessibility-reviewer` (`accessibility-pass` skill)                              | §Accessibility                          | "Review this screen for accessibility — contrast, touch targets, focus order, semantic hierarchy, reliance on colour."               |
| 2   | Visual hierarchy   | `ux-reviewer` + `design-system-reviewer` (`visual-polish` / `design-system-check`) | §Typography, §Layout & Spacing          | "Ignore whether it looks attractive. Evaluate whether visual hierarchy reflects the importance of information and actions."          |
| 3   | Content            | `copy-reviewer`                                                                    | §Product Content                        | "Review the interface copy — labels that are ambiguous, overly technical, too long, or don't describe the consequence of an action." |
| 4   | Interaction-states | `interaction-states-reviewer`                                                      | §Interaction & States, §Required States | "Evaluate only interactions and states — missing/wrong hover, focus, loading, empty, error, success, disabled."                      |

After each pass: apply fixes **one at a time** (each stays reviewable), re-screenshot the affected
widths, then start the next pass.

## Ordered vs parallel — pick by the job

- **Ordered critique (this page)** = _refining one screen_. Fixes are sequenced so they don't regress
  earlier lenses. Run it via the `design-critique` skill when polishing a screen from correct to crafted.
- **Parallel review batch** = _a fast read of a PR_. The design + a11y reviewer agents run as parallel
  groups (the sprint's phase-05 review). Faster, but read-only — it finds, it doesn't sequence fixes.

Both use the same reviewer agents; they differ only in ordering. Use ordered when you're going to fix;
use parallel when you're triaging.

## Gate

`pnpm verify:quick`, plus `pnpm verify:contrast` if any colour moved, and a final screenshot review at
375 / 768 / 1280. A screen that renders is not done — a screen you have not critiqued across all four
lenses is not done either.
