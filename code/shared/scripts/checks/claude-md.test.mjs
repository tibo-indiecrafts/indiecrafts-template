import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(HERE, "claude-md.mjs");

// Integration guard: the repo's briefs must pass the checker (commands resolve, no
// misplaced toolkit dirs). Regresses if a brief cites a non-existent pnpm command.
test("check:claude-md passes on the repo", () => {
  const out = execFileSync("node", [SCRIPT], { encoding: "utf8" });
  assert.match(out, /✓ check:claude-md/);
});
