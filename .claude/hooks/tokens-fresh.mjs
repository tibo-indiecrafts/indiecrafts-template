#!/usr/bin/env node
/**
 * PostToolUse (Edit|Write|MultiEdit) — keep the generated design tokens in sync.
 * When `ui-tokens/src/shared/tokens.json` (the DTCG source) is edited, regenerate
 * globals.css / native / hex so they never drift. Local, opt-in hook — wire it
 * as a PostToolUse entry in `.claude/settings.json`. No-op for every other file.
 *
 * The hard gate is `pnpm tokens:check` (in `pnpm verify`) + the commit lint-staged
 * run; this hook is just the fast local nudge so the agent works with fresh output.
 */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

let input = {};
try {
  input = JSON.parse(readFileSync(0, "utf8"));
} catch {
  process.exit(0);
}
const file = input?.tool_input?.file_path ?? "";
if (!/ui-tokens\/src\/shared\/tokens\.json$/.test(file)) process.exit(0);

try {
  execSync("pnpm tokens:build", {
    cwd: process.env.CLAUDE_PROJECT_DIR,
    stdio: "pipe",
  });
  console.log("🎨 tokens.json changed → regenerated globals.css / native / hex (pnpm tokens:build).");
} catch {
  console.log("🎨 tokens.json changed — run `pnpm tokens:build` (auto-run failed).");
}
