---
name: debug-discipline
description: Diagnose a bug root-cause-first before patching — reproduce, isolate, hypothesise, then one change at a time. Use when chasing a bug, a stack trace, a failing test, a flaky test, or "why is this broken", instead of trying fixes at random.
---

# Debug discipline

Stop the flailing loop: five plausible fixes in a row, none diagnosed, the codebase worse
than when you started. A bug ticket names a **symptom**; this skill finds the **cause**.
The lazy fix IS the root-cause fix — one guard where every caller routes through beats a
patch on each caller.

## The loop — never skip a step

1. **Reproduce first.** Get a deterministic repro before touching any code. A bug you can't
   reproduce, you can't verify you fixed. For a reported bug, write the **failing test** that
   reproduces it (`*.test.*` colocated, per the `testing` rule) — that test is the finish line.
2. **Isolate before you patch.** Narrow to the smallest failing unit: binary-search the diff
   (`git log`/`git bisect`), bisect the input, add a log at the boundary and read it back
   (`read_console_messages` for browser, `logger.*` in code). Grep **every caller** of the
   function you suspect — the cause is often one layer up, shared by callers the ticket
   doesn't name.
3. **State one hypothesis** before changing code: "X is null because Y returns undefined when
   Z." Name the mechanism, not the symptom. No hypothesis → you're guessing, go back to 2.
4. **Change one thing.** Make the smallest edit that tests the hypothesis. Re-run the repro.
5. **Revert if wrong.** If the repro still fails, the hypothesis was wrong — **`git checkout`
   the change** (don't leave it "just in case") and return to step 3. Speculative edits left
   in place are how a one-line bug becomes a five-file mess.

## Rules

- **Root cause, not symptom.** Fix where all callers route through, once — not the one path
  the ticket names, leaving every sibling caller still broken.
- **One change at a time.** Two edits between repro runs and you don't know which one mattered
  (or which one broke something else).
- **Never weaken the check to make red go green.** Don't delete the assertion, widen the type
  with `as any`, loosen the test, or swallow the error to silence it — that hides the bug, it
  doesn't fix it. (See the `testing` rule + the `code-patterns` ❌/✅ library.)
- **Keep the repro.** The failing test you wrote in step 1 stays as the regression guard.
- **Two or three fixes deep with no diagnosis → stop.** Delete the speculative edits, go back
  to step 2, and isolate properly. Flailing is the failure mode this skill exists to prevent.

## When you're stuck

State plainly what you've ruled out and what the narrowest failing case is now — then isolate
one level deeper (a smaller input, an earlier boundary, an upstream caller). Don't widen the
blast radius hoping to stumble onto it.
