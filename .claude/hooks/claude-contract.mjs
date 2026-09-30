#!/usr/bin/env node
// SessionStart hook — surfaces the .claude/ contract up front (it is not auto-loaded)
// so the agent follows placement + compactness rules BEFORE the first edit, and
// captures new learnings into the right brief. Compact by design; keep it short.
const msg = [
  "📐 .claude contract (see .claude/README.md):",
  "• agents/ · hooks/ · settings.json live ONLY in the repo-root .claude/; skills + rules are root by default (path-scope with `paths:`).",
  "• a brief (CLAUDE.md) is a MAP: ≤ 90 lines, ≤ 200 with its @imports (pnpm check:claude-md fails past 200). Mention files in backticks — a bare @path imports it.",
  "• every pnpm command you cite in a brief or rule must resolve to a real root/unit script.",
  "• learned a convention/gotcha this session? put it where it loads: a fact → nearest brief (/brief) · a procedure → a skill · one file type → a paths:-scoped rule · detail → code/docs/.",
].join("\n");
console.log(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: msg,
    },
  }),
);
