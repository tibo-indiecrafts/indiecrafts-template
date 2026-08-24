#!/usr/bin/env bash
# Stop hook — change-hygiene gate. Blocks the turn end when code under code/**
# changed but its docs AND/OR its tests did not, so a change never lands without
# the matching doc + test (or an explicit, stated waiver). A colocated Storybook
# story counts as the visual test, and a NEWLY-CREATED UI component must ship its
# own colocated `*.stories.tsx` (this repo documents every renderable component in
# Storybook). It ALSO nudges when the root package.json scripts and .vscode/tasks.json
# drift out of sync — reusing the `pnpm tasks:check` guard, so every root script keeps
# its Run Task entry. Committed + wired in .claude/settings.json, so it ships with the template.
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
# "Documented" = a code/docs page OR an area CHANGELOG.md (this repo's real model is
# "docs page AND/OR the area changelog at the change's home altitude") — either counts.
docs=$(printf '%s\n' "$changed" | grep -E '^code/docs/|CHANGELOG\.md$')
# A colocated Storybook story counts as the visual/component test (this repo's
# "visual = colocated stories" rule), alongside *.test.* and e2e specs.
tests=$(printf '%s\n' "$changed" | grep -E '\.(test|spec|stories)\.|/e2e/')

# A NEW UI component must ship a colocated `*.stories.tsx` — the repo documents
# every renderable brick/surface component in Storybook. Detect just-added `.tsx`
# under a UI dir (excluding stories/tests/index/type-decls/hooks) that has no
# sibling story on disk. `--porcelain` status: added (`A`) or untracked (`??`).
added=$(git -C "$root" status --porcelain 2>/dev/null | grep -E '^(A|\?\?)' | awk '{print $NF}')
new_ui=$(printf '%s\n' "$added" \
  | grep -E '^code/.*(/user-interface/|/ui/src/|/ui-components/src/|/ui-native/src/|/ui-icons/src/|/system-pages/src/|/renderer/src/|/components/).*\.tsx$' \
  | grep -Ev '\.(stories|test|spec)\.|/index\.tsx$|\.d\.ts$|/use-[a-z]')
story_gap=""
for f in $new_ui; do
  [ -f "$root/${f%.tsx}.stories.tsx" ] || story_gap="${story_gap}${f##*/} "
done

# Did the root package.json scripts or the VS Code task list change? If so, the two
# must stay in sync (every root script has a Run Task entry). Reuse the one guard —
# no duplicated logic, scoped so it never nags on unrelated turns.
tasks_touched=$(printf '%s\n' "$changed" | grep -E '^package\.json$|^\.vscode/tasks\.json$')
tasks_drift=""
if [ -n "$tasks_touched" ] &&
  ! (cd "$root" && node code/shared/scripts/checks/tasks-sync.mjs --check) >/dev/null 2>&1; then
  tasks_drift="the root package.json scripts and .vscode/tasks.json are out of sync — run pnpm tasks:check and add the missing Run Task entry"
fi

# Nothing relevant changed → nothing to gate.
[ -z "$code" ] && [ -z "$tasks_drift" ] && [ -z "$story_gap" ] && exit 0

# Docs/tests gate applies only to changed code/** source.
missing=""
if [ -n "$code" ]; then
  [ -z "$docs" ] && missing="the matching docs/ page or an area CHANGELOG.md (log the change at its home altitude)"
  if [ -z "$tests" ]; then
    [ -n "$missing" ] && missing="$missing, and "
    missing="${missing}a test (a colocated *.test.* or an e2e/journeys/ spec)"
  fi
fi

reason=""
[ -n "$missing" ] && reason="Code changed under code/ but not ${missing}."
if [ -n "$tasks_drift" ]; then
  [ -n "$reason" ] && reason="$reason Also, ${tasks_drift}."
  [ -z "$reason" ] && reason="Note: ${tasks_drift}."
fi
if [ -n "$story_gap" ]; then
  gap="New UI component(s) without a colocated Storybook story: ${story_gap}— add a \`*.stories.tsx\` beside each (visual = colocated stories)."
  [ -n "$reason" ] && reason="$reason ${gap}"
  [ -z "$reason" ] && reason="$gap"
fi

if [ -n "$reason" ]; then
  reason="${reason} Update it, then stop again. If a doc/test/story genuinely is not warranted (config, types, generated, a non-visual .tsx, or presentational-only), say so explicitly."
  printf '{"decision":"block","reason":"%s"}' "$reason"
fi
exit 0
