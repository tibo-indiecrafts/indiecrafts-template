#!/usr/bin/env bash
# Re-vendor the general agent suite into .claude/agents/ from a source-of-truth.
# NEVER touches .claude/agents/project/ (the template's own reviewers) or the README.
# Usage: scripts/sync-agents.sh [SOURCE_DIR]   (default: ~/.claude/agents)
set -euo pipefail

SRC="${1:-$HOME/.claude/agents}"
DEST="$(cd "$(dirname "$0")/.." && pwd)/.claude/agents"
CATEGORIES=(architecture core-development deployment developer-experience engineering \
  implementation marketing project-management quality-security testing)

[ -d "$SRC" ] || { echo "source not found: $SRC" >&2; exit 1; }

echo "Syncing agents from $SRC → $DEST (project/ preserved)"
for d in "${CATEGORIES[@]}"; do
  if [ -d "$SRC/$d" ]; then
    rm -rf "${DEST:?}/$d"
    cp -R "$SRC/$d" "$DEST/"
    echo "  + $d ($(ls "$DEST/$d"/*.md 2>/dev/null | wc -l | tr -d ' '))"
  fi
done
[ -f "$SRC/agent-coordinator.md" ] && cp "$SRC/agent-coordinator.md" "$DEST/"
echo "Done. project/ untouched: $(ls "$DEST/project"/*.md | wc -l | tr -d ' ') template reviewers."
