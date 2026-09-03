#!/usr/bin/env bash
# Remove build artifacts across the workspace. `--all` also wipes node_modules
# (then run `pnpm install`). Safe: only ever removes generated/ignored dirs.
#
#   pnpm clean          # .next .turbo .open-next dist storybook-static .vitepress/dist
#   pnpm clean --all    # the above + all node_modules

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# The workspace root (git top-level) — move-proof, unlike a fixed number of
# `dirname`s (this script lives 4 levels deep at code/shared/scripts/dev/).
ROOT_DIR="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
cd "$ROOT_DIR"

ARTIFACTS=(.next .turbo .open-next dist out storybook-static .vitepress/dist .vitepress/cache tsconfig.tsbuildinfo)

echo "Cleaning build artifacts…"
for name in "${ARTIFACTS[@]}"; do
  find . -name node_modules -prune -o -name "$name" -print0 2>/dev/null | xargs -0 rm -rf 2>/dev/null || true
done

if [ "${1:-}" = "--all" ]; then
  echo "Removing all node_modules (run 'pnpm install' after)…"
  find . -name node_modules -type d -prune -print0 2>/dev/null | xargs -0 rm -rf 2>/dev/null || true
fi

echo "✓ Clean complete."
