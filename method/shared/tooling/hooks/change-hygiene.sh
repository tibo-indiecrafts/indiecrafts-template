#!/usr/bin/env bash
# Stop hook — change-hygiene gate. Blocks the turn end when code under code/**
# changed but its docs AND/OR its tests did not, so a change never lands without
# the matching doc + test (or an explicit, stated waiver). Local-only
# (wired in settings.local.json).
#
# Escape valve: Claude Code sets stop_hook_active=true on the continuation that a
# previous block triggered — honor it so the gate fires at most once per
# stop-chain and never loops.

input=$(cat)
case "$input" in
  *'"stop_hook_active":true'* | *'"stop_hook_active": true'*) exit 0 ;;
esac

root="${CLAUDE_PROJECT_DIR:-.}"
changed=$(git -C "$root" status --porcelain 2>/dev/null | awk '{print $NF}')

# Source that plausibly needs a doc/test — exclude tests, stories, generated
# files, type decls, config, and changelogs (they legitimately need neither).
code=$(printf '%s\n' "$changed" \
  | grep -E '^code/.*\.(ts|tsx|mjs)$' \
  | grep -Ev '\.(test|spec|stories)\.|\.d\.ts$|generated|\.config\.|CHANGELOG')
docs=$(printf '%s\n' "$changed" | grep -E '^docs/')
tests=$(printf '%s\n' "$changed" | grep -E '\.(test|spec)\.|/e2e/')

[ -z "$code" ] && exit 0

missing=""
[ -z "$docs" ] && missing="the matching docs/ page (and its sidebar in docs/.vitepress/config.mts)"
if [ -z "$tests" ]; then
  [ -n "$missing" ] && missing="$missing, and "
  missing="${missing}a test (a colocated *.test.* or an e2e/journeys/ spec)"
fi

if [ -n "$missing" ]; then
  reason="Code changed under code/ but not ${missing}. Update it, then stop again. If a doc or test genuinely is not warranted (config, types, generated, or presentational-only), say so explicitly."
  printf '{"decision":"block","reason":"%s"}' "$reason"
fi
exit 0
