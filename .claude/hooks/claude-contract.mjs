#!/usr/bin/env node
// SessionStart hook — surfaces the .claude/ contract up front (it is not auto-loaded)
// so the agent follows placement + compactness rules BEFORE the first edit, and
// captures new learnings into the right brief. Compact by design; keep it short.
const msg = [
  "📐 .claude contract (see .claude/README.md):",
  "• commands/ · agents/ · skills/ · settings.json live ONLY in the repo-root .claude/ (nested ones don't load).",
  "• briefs (CLAUDE.md) + rules/ are per-folder; a brief is a MAP, not a manual — keep it ≤ ~90 lines (pnpm check:claude-md enforces).",
  "• every pnpm command you cite in a brief must resolve to a real root/unit script.",
  "• discovered a new convention/pattern/gotcha this session? capture it in the nearest .claude/CLAUDE.md brief (via /brief) so it compounds — don't let it evaporate.",
].join("\n");
console.log(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: msg,
    },
  }),
);
