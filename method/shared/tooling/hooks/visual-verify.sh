#!/usr/bin/env bash
# Stop hook — visual-verify gate. Blocks the turn end when a UI file changed but
# the change wasn't browser-verified, so a screen never lands without someone
# looking at the rendered pixels (or an explicit, stated waiver). Local-only
# (wired in settings.local.json). Mirrors change-hygiene.sh.
#
# It can't detect "did you screenshot" — so it fires on a UI-file change and
# reminds; the waiver ("logic-only", "no running app", "presentational, covered
# by a story") is you saying why in the reply, exactly like change-hygiene.
#
# Escape valve: Claude Code sets stop_hook_active=true on the continuation a
# previous block triggered — honor it so the gate fires at most once per
# stop-chain and never loops.

input=$(cat)
case "$input" in
  *'"stop_hook_active":true'* | *'"stop_hook_active": true'*) exit 0 ;;
esac

root="${CLAUDE_PROJECT_DIR:-.}"
changed=$(git -C "$root" status --porcelain 2>/dev/null | awk '{print $NF}')

# UI source a human should look at rendered: app views + shared UI components.
# Exclude tests, stories, and Storybook (the visual snapshot already covers static
# presentation).
ui=$(printf '%s\n' "$changed" \
  | grep -E '\.tsx$' \
  | grep -E '(/user-interface/|/components/|/renderers/|code/packages/ui/|code/packages/ui-components/)' \
  | grep -Ev '\.(test|spec|stories)\.')

[ -z "$ui" ] && exit 0

reason="UI changed but the turn is ending without a browser check. Render it: /run the app, connect the dev tab (/connect-chrome — the real localhost tab, not a blank one), screenshot 375/768/1280, and review the images (see the visual-verification rule). If browser verification genuinely does not apply — a logic-only change, no running app in this environment, or presentational-only covered by a Storybook story — say so explicitly."
printf '{"decision":"block","reason":"%s"}' "$reason"
exit 0
