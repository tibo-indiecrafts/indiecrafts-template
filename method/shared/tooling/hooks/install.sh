#!/usr/bin/env bash
# Install the studio on-the-fly Claude Code hooks into a fresh clone.
#
# The hook scripts + wiring are gitignored (local-by-design, never shipped), so a
# clone starts with none. This copies the canonical scripts here into
# `.claude/hooks/` and seeds `.claude/settings.local.json` from the example.
# Both destinations stay gitignored. Run from anywhere in the repo.
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
here="$(cd "$(dirname "$0")" && pwd)"

mkdir -p "$root/.claude/hooks"
cp "$here/change-hygiene.sh" "$here/a11y-check.mjs" "$root/.claude/hooks/"
chmod +x "$root/.claude/hooks/change-hygiene.sh"
echo "✓ scripts → $root/.claude/hooks/"

target="$root/.claude/settings.local.json"
if [ -f "$target" ]; then
  echo "⚠ $target already exists — merge the \"hooks\" block from"
  echo "  $here/settings.local.example.json into it by hand (don't clobber your permissions)."
else
  cp "$here/settings.local.example.json" "$target"
  echo "✓ wiring → $target"
fi

echo "Done. Restart Claude Code and approve the hooks on first run."
echo "Note: the impeccable design card/deep-pass needs the global ~/.claude/skills/impeccable skill (installed separately)."
