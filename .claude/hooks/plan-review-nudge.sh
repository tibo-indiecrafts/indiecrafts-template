#!/usr/bin/env bash
# PreToolUse hook (matcher: ExitPlanMode) — plan-mode auto-review trigger. Just before a
# plan is finalized, nudge (advisory, NEVER blocks) to run a gstack plan review on it.
# The nudge shows in the transcript right when the user is deciding whether to approve.
# gstack-only + personal, so it is wired in settings.local.json (gitignored). Committed
# here but a no-op unless wired AND gstack is present (mirrors tokens-fresh/visual-verify).

cat >/dev/null 2>&1 # drain stdin (ExitPlanMode carries no useful tool_input)
[ -d "$HOME/.claude/skills/gstack" ] || exit 0

# ExitPlanMode has no file_path — the plan it finalizes is the newest file in the plans dir.
latest=$(ls -t "$HOME/.claude/plans"/*.md 2>/dev/null | head -1)
name=""
[ -n "$latest" ] && name=" ($(basename "$latest"))"

printf 'Plan-review nudge (advisory): before approving this plan%s, consider a gstack plan review — `/autoplan` (CEO + eng + design + DX) for a full pass, or `/plan-eng-review` for architecture, edge cases, and test coverage.\n' "$name"
exit 0
