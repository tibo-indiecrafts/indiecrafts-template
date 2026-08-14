#!/usr/bin/env bash
# Re-vendor the general agent suite into .claude/agents/ from a source-of-truth,
# then split it: agents WIRED into a workflow phase stay in their topic folder;
# every other (unwired) agent moves to .claude/agents/bench/<topic>/.
# NEVER touches .claude/agents/project/ (the template's own reviewers) or the README.
#
# Usage:
#   scripts/sync-agents.sh [SOURCE_DIR]   re-vendor (default SRC: ~/.claude/agents) + split
#   scripts/sync-agents.sh --split-only   re-run the split on the current tree, no re-vendor
#   scripts/sync-agents.sh --dry-run      print the wired/bench split, move nothing
set -euo pipefail

DEST="$(cd "$(dirname "$0")/.." && pwd)/.claude/agents"
CATEGORIES=(architecture core-development deployment developer-experience engineering \
  implementation marketing project-management quality-security testing)

# WIRED = vendored agents referenced by a method step: a phase batch, the Growth/GTM lane, a
# stack-option (registry `my-skills-and-agents.md`), OR a use-case-tagged Optional (`bench-map.md`
# § A). KEEP IN STEP with those files: a name here stays in its topic folder (outside bench);
# everything else (only `bench-map.md` § D "Skip") is benched. [local] project/ + [global] built-ins
# are not listed.
WIRED=(
  system-architect backend-architect data-architect security-architect project-planner
  frontend-developer fullstack-developer refactoring-specialist rapid-prototyper
  accessibility-tester code-reviewer architect-reviewer security-analyzer security-auditor penetration-tester
  test-writer-fixer qa-expert test-automator e2e-test-automator integration-test-builder
  unit-test-generator test-architect test-results-analyzer performance-benchmarker
  deployment-ops-manager devops-automator cicd-builder release-compiler project-shipper
  uat-coordinator git-manager documentation-engineer
  progress-tracker experiment-tracker
  debugger error-detective dependency-manager code-refactoring-specialist legacy-modernizer
  # Growth lane (Business & ops)
  growth-hacker instagram-curator reddit-community-builder tiktok-strategist twitter-engager
  # Stack options (PLAN/BUILD/TEST — surface-gated)
  api-designer database-schema-designer graphql-architect backend-developer
  websocket-engineer cli-developer mcp-developer mobile-developer api-tester
  # Optional — on-demand, use-case-referenced (bench-map § A)
  tool-evaluator ui-designer interface-designer modular-systems-architect design-reviewer
  config-expert code-commentator build-engineer dx-optimizer compliance-auditor
)

MODE="revendor"
case "${1:-}" in
  --split-only) MODE="split" ;;
  --dry-run) MODE="dry" ;;
  "") SRC="$HOME/.claude/agents" ;;
  *) SRC="$1" ;;
esac

# agent name = frontmatter `name:`, else the filename (how Claude Code names it).
agent_name() {
  local n
  n=$(sed -n 's/^name:[[:space:]]*//p' "$1" | head -1 | tr -d '\r' | sed 's/[[:space:]]*$//')
  [ -n "$n" ] && printf '%s' "$n" || basename "$1" .md
}
is_wired() { local n="$1" w; for w in "${WIRED[@]}"; do [ "$w" = "$n" ] && return 0; done; return 1; }

# 1. Re-vendor (default only): wipe + recopy each topic folder from the source.
if [ "$MODE" = "revendor" ]; then
  [ -d "$SRC" ] || { echo "source not found: $SRC" >&2; exit 1; }
  echo "Vendoring from $SRC → $DEST"
  for d in "${CATEGORIES[@]}"; do
    [ -d "$SRC/$d" ] || continue
    rm -rf "${DEST:?}/$d"
    cp -R "$SRC/$d" "$DEST/"
  done
  [ -f "$SRC/agent-coordinator.md" ] && cp "$SRC/agent-coordinator.md" "$DEST/"
fi

# 2. Split. Idempotent from ANY state (fresh vendor OR already-split): fold any
#    existing bench back into the topic folders first, then re-classify + re-split.
#    (Never blindly `rm -rf bench` before re-benching — on an already-split tree the
#    unwired agents live in bench/, so that would delete them.)
kept=0; benched=0

if [ "$MODE" = "dry" ]; then
  while IFS= read -r f; do
    case "$f" in */project/*) continue ;; esac
    [ "$(basename "$f")" = "README.md" ] && continue
    name=$(agent_name "$f")
    if is_wired "$name"; then kept=$((kept + 1)); else benched=$((benched + 1)); echo "  bench: ${f#"$DEST"/}  [$name]"; fi
  done < <(find "$DEST" -name '*.md')
  echo "Split (dry): $kept wired · $benched bench. Nothing moved."
  exit 0
fi

if [ -d "$DEST/bench" ]; then
  for d in "${CATEGORIES[@]}"; do
    [ -d "$DEST/bench/$d" ] || continue
    mkdir -p "$DEST/$d"
    mv "$DEST/bench/$d"/*.md "$DEST/$d/" 2>/dev/null || true
  done
  [ -f "$DEST/bench/agent-coordinator.md" ] && mv "$DEST/bench/agent-coordinator.md" "$DEST/"
  rm -rf "${DEST:?}/bench"
fi

for d in "${CATEGORIES[@]}"; do
  [ -d "$DEST/$d" ] || continue
  for f in "$DEST/$d"/*.md; do
    [ -e "$f" ] || continue
    name=$(agent_name "$f")
    if is_wired "$name"; then
      kept=$((kept + 1))
    else
      benched=$((benched + 1))
      mkdir -p "$DEST/bench/$d"
      mv "$f" "$DEST/bench/$d/"
    fi
  done
  rmdir "$DEST/$d" 2>/dev/null || true # drop topic folder if now all-bench
done
if [ -f "$DEST/agent-coordinator.md" ]; then
  benched=$((benched + 1)); mkdir -p "$DEST/bench"; mv "$DEST/agent-coordinator.md" "$DEST/bench/"
fi

echo "Split: $kept wired (topic folders) · $benched bench (.claude/agents/bench/). project/ untouched: $(ls "$DEST/project"/*.md 2>/dev/null | wc -l | tr -d ' ')."
