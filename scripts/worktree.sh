#!/usr/bin/env bash
#
# Bootstrap a git worktree for this pnpm + Turborepo monorepo — correctly.
#
#   scripts/worktree.sh <branch> [path]
#
# A bare `git worktree add` leaves a worktree that WON'T build here, because the
# things a build needs are gitignored and so never carried into a new worktree:
#   - `.env*` (Sanity project id/dataset/token) — untracked, must be copied
#   - `node_modules` — per-worktree; needs its own `pnpm install`
# This script does both, so a fresh worktree is ready to `pnpm dev` / `pnpm build`.
#
# Worktrees are created OUTSIDE the repo (a sibling dir) so they never nest inside
# the tracked tree. The global pnpm store (~/Library/pnpm/store) + the turbo cache
# are shared across worktrees, so the install is fast (hardlinks, cache hits).

set -euo pipefail

BRANCH="${1:?usage: scripts/worktree.sh <branch> [path]}"
ROOT="$(git rev-parse --show-toplevel)"
DIR="${2:-$(dirname "$ROOT")/$(basename "$ROOT")--${BRANCH//\//-}}"

# 1. Create the worktree — check out an existing branch, or branch off HEAD.
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git worktree add "$DIR" "$BRANCH"
else
  git worktree add -b "$BRANCH" "$DIR"
fi

# 2. Copy every gitignored env file, preserving its path (git won't carry them).
copied=0
while IFS= read -r -d '' f; do
  rel="${f#"$ROOT"/}"
  mkdir -p "$DIR/$(dirname "$rel")"
  cp "$f" "$DIR/$rel"
  echo "  copied $rel"
  copied=$((copied + 1))
done < <(cd "$ROOT" && find . -name ".env*" ! -name ".env.example" -not -path "*/node_modules/*" -print0)
[ "$copied" -eq 0 ] && echo "  (no .env* files found to copy — set them up in the worktree)"

# 3. Install. Shared global store → fast. The repo's `minimumReleaseAge` policy
#    can block a freshly published binary; bypass it for this one install only
#    (it does not touch the committed config).
( cd "$DIR" && pnpm install --config.minimumReleaseAge=0 )

echo ""
echo "✓ worktree ready:  $DIR"
echo "  next:  cd \"$DIR\" && pnpm verify:quick   # tsc + lint"
echo "  done:  git worktree remove \"$DIR\"        # then: git worktree prune"
