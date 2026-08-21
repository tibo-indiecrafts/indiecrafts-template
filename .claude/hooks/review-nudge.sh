#!/usr/bin/env bash
# Stop hook — auto-review trigger. Scans the working-tree diff and, when a threshold is
# crossed, prints a NON-BLOCKING advisory recommending the matching gstack review skill
# (or a generic nudge when gstack isn't installed, so teammates still get value). It
# NEVER blocks — the repo's blocking gates are guard.mjs (PreToolUse) + change-hygiene.sh
# (Stop). Committed + wired in .claude/settings.json, so it ships with the template.
#
# Escape valve: honor stop_hook_active so it fires at most once per stop-chain.

input=$(cat)
case "$input" in
  *'"stop_hook_active":true'* | *'"stop_hook_active": true'*) exit 0 ;;
esac

root="${CLAUDE_PROJECT_DIR:-.}"
gstack=""
[ -d "$HOME/.claude/skills/gstack" ] && gstack=1

# Changed files (tracked + untracked); bail if the tree is clean.
changed=$(git -C "$root" status --porcelain 2>/dev/null | awk '{print $NF}')
[ -z "$changed" ] && exit 0

# Tracked-diff line count vs HEAD (added + removed; binary "-" counts as 0 in awk).
lines=$(git -C "$root" diff HEAD --numstat 2>/dev/null | awk '{a+=$1; d+=$2} END{print a+d+0}')
lines=${lines:-0}

# Security-sensitive paths (env [not .env.example] / CI / infra / deps / SQL).
sensitive=$(printf '%s\n' "$changed" \
  | grep -Ev '\.env\.example$' \
  | grep -E '(^|/)\.env($|\.)|/\.github/|wrangler\.toml|/infra/|(^|/)package\.json$|(^|/)pnpm-lock\.yaml$|\.sql$|/migrations/')
# UI / renderer changes.
ui=$(printf '%s\n' "$changed" | grep -E '\.tsx$' | grep -E 'user-interface|renderer|/components/|packages/web/ui')
# Mobile (Expo / React Native) changes — the surface + the RN bricks.
mobile=$(printf '%s\n' "$changed" | grep -E 'code/projects/mobile/|code/packages/mobile/')

BIG=150 # changed-line threshold worth a diff review
recs=""
add() { recs="${recs}${1}"$'\n'; }

if [ "$lines" -ge "$BIG" ]; then
  if [ -n "$gstack" ]; then
    if [ "$lines" -ge 200 ]; then
      add "• Large diff (${lines} lines) — run \`/review\` (and \`/codex\` for the ≥200-line P1 gate) before landing."
    else
      add "• Sizable diff (${lines} lines) — consider \`/review\` before landing."
    fi
  else
    add "• Sizable diff (${lines} lines) — review it before landing."
  fi
fi
if [ -n "$sensitive" ]; then
  if [ -n "$gstack" ]; then
    add "• Security-sensitive paths changed (env / CI / infra / deps / SQL) — run \`/cso\`."
  else
    add "• Security-sensitive paths changed (env / CI / infra / deps / SQL) — do a security review."
  fi
fi
if [ -n "$ui" ]; then
  if [ -n "$gstack" ]; then
    add "• UI / renderer changed — run \`/qa\` (real-browser) to catch regressions; \`/benchmark\` for Core Web Vitals if perf matters."
  else
    add "• UI / renderer changed — verify it in a browser."
  fi
fi
if [ -n "$mobile" ]; then
  # RN-appropriate checks (the website lint hook skips RN files) + the Expo skills for SDK-52 APIs.
  add "• Mobile (Expo/RN) changed — run \`npx expo lint\` + \`npx expo-doctor\`; lean on the Expo skills (\`expo plugin\`) for SDK-52 APIs."
fi

[ -z "$recs" ] && exit 0
printf 'Review nudge (advisory — not blocking):\n%s' "$recs"
exit 0
