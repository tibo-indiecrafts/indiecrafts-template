#!/usr/bin/env bash
# PreToolUse (matcher: ExitPlanMode) — AUTO-GRILL every plan before it is finalized.
# A hook can't run a skill or safely hard-block ExitPlanMode (a blocking deny would loop:
# ExitPlanMode re-fires after grilling), so it injects an imperative nudge. Prefers the
# doc-grounded `grill-with-docs`, falls back to `grill-me`. No-op if neither is installed.
# Personal → wired in settings.local.json (like plan-review-nudge). Off: say "stop grilling".
cat >/dev/null 2>&1 # ExitPlanMode carries no useful tool_input; drain stdin

skill="grill-me"
[ -d "$HOME/.claude/skills/grill-with-docs" ] && skill="grill-with-docs" # doc-grounded, preferred
[ -d "$HOME/.claude/skills/$skill" ] || exit 0

printf 'GRILL FIRST — do not present this plan yet (if you ALREADY grilled it this turn, proceed). Invoke the **%s** skill and hard-grill the plan — one question at a time, a recommended answer on each; read the files/code/docs to answer what you can before asking:\n' "$skill"
printf '  • Riskiest assumption — what must be true for this to work, and what breaks if it is not?\n'
printf '  • What you are NOT doing — the cut scope, and why cutting it is safe.\n'
printf '  • Edge cases + failure modes — the unhappy path, partial failure, bad input.\n'
printf '  • Reversibility + blast radius — how hard to undo if wrong, and what it touches.\n'
printf '  • Simpler path (ponytail) — is there a lazier version that is ~80%% of the value?\n'
printf 'Fold what survives back into the plan, then present it. The user wants heavy grilling — do not go easy. Bypass once: "skip grill".\n'
exit 0
