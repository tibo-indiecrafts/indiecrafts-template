---
description: Hard grill-me stress-test of the current plan before you approve it
argument-hint: [what to grill, or blank for the current plan]
---

Pressure-test before you commit. Target: **$ARGUMENTS** (blank = the plan/decision on the table).

Invoke the **`grill-with-docs`** skill (doc-grounded — falls back to **`grill-me`** if it isn't installed)
and run it hard on the target. Drive at each dimension — one question at a time, a recommended answer on
each; if the answer is in the files/code/docs, read them instead of asking:

- **Riskiest assumption** — what must be true for this to work; what breaks if it isn't.
- **What you're NOT doing** — the cut scope, and why cutting it is safe.
- **Edge cases · failure modes** — the unhappy path, partial failure, bad input.
- **Reversibility · blast radius** — cost to undo if wrong; what it touches.
- **Simpler path (ponytail)** — the lazier version that's ~80% of the value.

Fold what survives back into the plan, then present it. Also fires automatically before `ExitPlanMode` via
`.claude/hooks/grill-plan.sh`.
