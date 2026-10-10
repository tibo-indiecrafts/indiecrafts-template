#!/usr/bin/env bash
# React Doctor regression check — advisory Stop hook, never blocks the turn.
# Runs `doctor:changed` (changed vs main) in EVERY web surface that has one (website · admin ·
# app — each reads its own doctor.config.jsonc), on every Stop, even with a clean working tree:
# the branch's committed changes still count against main. The surfaces run in parallel and
# each prints its score + findings. Exit 0 always.
#
# ponytail: `npx react-doctor@latest` fetches over the network each run. If Stop feels slow,
# pin react-doctor as a devDependency, or add a "ran in last N min" debounce here.
set +e

ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$ROOT" || exit 0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

OUT="$(mktemp -d)"
trap 'rm -rf "$OUT"' EXIT

found=0
for dir in code/projects/*/surfaces/*/; do
  grep -q '"doctor:changed"' "$dir/package.json" 2>/dev/null || continue
  found=1
  name="$(basename "$dir")"
  (cd "$dir" && pnpm -s doctor:changed >"$OUT/$name.log" 2>&1) &
done
[ "$found" = 1 ] || exit 0
wait

for log in "$OUT"/*.log; do
  name="$(basename "$log" .log)"
  echo "🩺 React Doctor — $name (changed vs main):"
  # The score, then each finding (rule + file); drop the share/footer noise.
  grep -E "Score:|No issues|⚠|✗|✖|src/|issues?$" "$log" | head -20
  echo
done
exit 0
