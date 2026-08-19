#!/usr/bin/env bash
# Re-vendor the general agent suite into .claude/agents/ from a source-of-truth.
# Every vendored agent lives in its topic folder — there is NO bench (removed; all
# agents are kept + categorised). NEVER touches .claude/agents/project/ (the
# template's own reviewers) or the README.
#
# Usage:
#   scripts/sync-agents.sh [SOURCE_DIR]   re-vendor (default SRC: ~/.claude/agents)
#   scripts/sync-agents.sh --dry-run      print what would re-vendor, copy nothing
set -euo pipefail

DEST="$(cd "$(dirname "$0")/.." && pwd)/.claude/agents"
# NOTE: `marketing/` is intentionally absent — content/marketing agents moved to the indie-brain
# vault (~/Code/indie-brain/.claude/agents/). This repo is code/dev-only.
CATEGORIES=(architecture core-development deployment developer-experience engineering \
  implementation project-management quality-security testing)

SRC="$HOME/.claude/agents"
MODE="revendor"
case "${1:-}" in
  --dry-run) MODE="dry" ;;
  "") ;;
  *) SRC="$1" ;;
esac

if [ "$MODE" = "dry" ]; then
  echo "Would re-vendor from $SRC → $DEST (topic folders + agent-coordinator.md; project/ + README untouched):"
  for d in "${CATEGORIES[@]}"; do
    [ -d "$SRC/$d" ] && echo "  $d/ ($(find "$SRC/$d" -name '*.md' | wc -l | tr -d ' ') agents)"
  done
  exit 0
fi

[ -d "$SRC" ] || { echo "source not found: $SRC" >&2; exit 1; }
echo "Vendoring from $SRC → $DEST"
for d in "${CATEGORIES[@]}"; do
  [ -d "$SRC/$d" ] || continue
  rm -rf "${DEST:?}/$d"
  cp -R "$SRC/$d" "$DEST/"
done
[ -f "$SRC/agent-coordinator.md" ] && cp "$SRC/agent-coordinator.md" "$DEST/"
echo "Vendored ${#CATEGORIES[@]} topic folders + agent-coordinator. project/ untouched: $(ls "$DEST/project"/*.md 2>/dev/null | wc -l | tr -d ' ')."
