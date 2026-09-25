#!/usr/bin/env node
// Stop hook (advisory) — runs the CLAUDE.md brief guard and surfaces ONLY hard errors
// (a `pnpm` command that resolves to nothing, or a misplaced commands/skills/agents dir).
// Silent when clean; bloat warnings are left for `pnpm check:claude-md` / CI. Never blocks.
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const check = join(root, "code/shared/scripts/checks/claude-md.mjs");
try {
  execFileSync("node", [check], { stdio: "pipe" });
} catch (e) {
  const out = `${e.stdout ?? ""}${e.stderr ?? ""}`;
  const issues = out.split("\n").filter((l) => /COMMAND|PLACE/.test(l));
  if (issues.length)
    console.error(
      `⚠ CLAUDE.md guard — ${issues.length} issue(s); run \`pnpm check:claude-md\`:\n${issues.join("\n")}`,
    );
}
process.exit(0);
