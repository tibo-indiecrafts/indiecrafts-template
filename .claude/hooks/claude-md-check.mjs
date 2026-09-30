#!/usr/bin/env node
// Stop hook (advisory) — runs the brief + rule guard and surfaces what this session broke or grew:
// errors (COMMAND · SIZE · IMPORT · PLACE) and map-budget warnings (BLOAT). The repo sits at zero of
// both, so any line here is new. Silent when clean. Never blocks.
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const check = join(root, "code/shared/scripts/checks/claude-md.mjs");
const { stdout = "", stderr = "" } = spawnSync("node", [check], {
  encoding: "utf8",
});
const issues = `${stdout}${stderr}`
  .split("\n")
  .filter((l) => /\b(COMMAND|SIZE|IMPORT|PLACE|BLOAT)\b/.test(l));
if (issues.length)
  console.error(
    `⚠ CLAUDE.md guard — ${issues.length} issue(s); run \`pnpm check:claude-md\` (route overflow per .claude/README.md):\n${issues.join("\n")}`,
  );
process.exit(0);
