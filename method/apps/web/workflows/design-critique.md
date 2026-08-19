# Workflow — design critique (ordered)

Refine a built screen with **four focused passes in a fixed order**, one lens at a time, fixing before
the next — not one giant "what's wrong". The runnable steps + ready prompts live in the
`design-critique` skill; this is the framework-discoverable checklist. Authority for every pass:
`code/packages/shared/ui-tokens/DESIGN.md`. Run after the pixels exist (`rules/visual-verification` —
screenshot at 375 / 768 / 1280) so each pass reads real frames.

Order is not arbitrary: **accessibility is the foundation**, so it is pass 1 — a later fix must never
regress it.

1. **Accessibility** → `accessibility-pass` skill / `accessibility-reviewer` agent. Contrast, targets,
   focus order, semantics, no-state-by-colour. Authority: DESIGN.md §Accessibility + `rules/accessibility`.
   Fix, `pnpm verify:contrast`, then move on.
   _Prompt:_ "Review this screen for accessibility — contrast, touch targets, focus order, semantic
   hierarchy, reliance on colour. Then fix the issues you found, one at a time."
2. **Visual hierarchy** → `visual-polish` / `ux-reviewer` (+ `design-system-check` / `design-system-reviewer`).
   Does the type scale match importance? One primary action? Spacing rhythm, elevation restraint.
   Authority: DESIGN.md §Typography + §Layout. Fix **without** undoing pass 1.
   _Prompt:_ "Ignore whether it looks attractive. Evaluate whether the visual hierarchy reflects the
   importance of information and actions. Then fix, one at a time."
3. **Content / copy** → `copy-reviewer` agent. Ambiguous / overly technical / too-long labels; does each
   label describe the *consequence* of its action? Voice, one-term consistency, locale parity, strings in
   `messages/`. Authority: DESIGN.md §Product Content + `shared/context/voice-guide`.
   _Prompt:_ "Review the interface copy — labels that are ambiguous, overly technical, unnecessarily
   long, or don't describe the consequence of an action. Then fix."
4. **Interaction-states** → `interaction-states-reviewer` agent. hover / focus / active / disabled /
   loading / empty / error / success / destructive-confirm — present and correct? Authority: DESIGN.md
   §Interaction & States + §Required States. Read the code for states the screenshot can't show.
   _Prompt:_ "Evaluate only interactions and states — missing or wrong hover, focus, loading, empty,
   error, success, disabled. Then fix."

## Finish

- Each pass: findings in priority order → fix **one at a time** → re-screenshot the affected widths →
  next pass. Never batch all four into one edit.
- `pnpm verify:quick`, and `pnpm verify:contrast` if any colour moved. Verify at 375 / 768 / 1280 + a
  touch device.
- This is the **refinement** loop (one screen). For a fast PR read use the phase-05 **parallel** review
  batch (`shared/process/my-skills-and-agents`) — the two coexist.
