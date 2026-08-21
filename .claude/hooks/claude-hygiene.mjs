#!/usr/bin/env node
// Stop hook — CLAUDE.md hygiene. PROPOSES (never edits) a brief review when a code
// unit's PUBLIC SURFACE changed (a new source file, or its package.json `exports`) but
// its `.claude/CLAUDE.md` did not — or when a code unit has no brief at all. It asks for
// a CONCISE, reflect-only-what-changed edit (briefs are maps, not logs). Committed +
// wired in .claude/settings.json, so it ships with the template.
//
// Escape valve: honor stop_hook_active so the gate fires at most once per stop-chain.
import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";

function stdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}
if (/"stop_hook_active"\s*:\s*true/.test(stdin())) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR || ".";
let changed;
try {
  // `-uall` lists untracked FILES individually (not a collapsed `dir/`), so a
  // freshly-created brief is matched instead of read as "brief not updated".
  changed = execSync("git status --porcelain -uall", { cwd: root, encoding: "utf8" })
    .split("\n")
    .filter(Boolean)
    .map((l) => {
      // A rename is `R  old -> new`; take the destination path.
      let p = l.slice(3).replace(/^"|"$/g, "");
      if (p.includes(" -> ")) p = p.split(" -> ").pop().replace(/^"|"$/g, "");
      return { status: l.slice(0, 2).trim(), path: p };
    });
} catch {
  process.exit(0);
}
const changedSet = new Set(changed.map((c) => c.path));

const isCode = (p) =>
  /^code\/.*\.(ts|tsx|mjs)$/.test(p) &&
  !/\.(test|spec|stories)\.|\.d\.ts$|generated|\.config\./.test(p);
const isPkg = (p) => /^code\/(packages|modules)\/.*\/package\.json$/.test(p);

// A "unit" = the nearest ancestor dir (under code/) holding a package.json.
function unitOf(p) {
  let d = dirname(p);
  while (d && d.startsWith("code")) {
    if (existsSync(join(root, d, "package.json"))) return d;
    const up = dirname(d);
    if (up === d) break;
    d = up;
  }
  return null;
}

const proposals = new Map(); // unit -> why
for (const { status, path } of changed) {
  if (!isCode(path) && !isPkg(path)) continue;
  const unit = unitOf(path);
  if (!unit) continue;
  const briefRel = join(unit, ".claude", "CLAUDE.md");
  const hasBrief = existsSync(join(root, briefRel));
  const isNew = status === "A" || status === "??";
  // Only a NEW source file signals the public surface likely grew (a format/devDep
  // change does not) — the low-noise trigger. A brick with code but no brief always qualifies.
  const surfaceEvent = isCode(path) && isNew;
  if (!hasBrief) {
    proposals.set(unit, "has no `.claude/CLAUDE.md` — add a short brief");
  } else if (surfaceEvent && !changedSet.has(briefRel) && !proposals.has(unit)) {
    proposals.set(unit, "changed its public surface but its `.claude/CLAUDE.md` wasn't updated");
  }
}

if (proposals.size) {
  const lines = [...proposals].slice(0, 8).map(([u, why]) => `  • ${u} ${why}`);
  const reason =
    "CLAUDE.md hygiene — a code unit's public surface changed but its brief did not:\n" +
    lines.join("\n") +
    "\n\nReview each briefly: reflect ONLY the new public surface (exports/purpose), edit — don't append " +
    "(a brief is a map, not a log; history goes in CHANGELOG.md); keep it concise. Or run `/brief <unit>`. " +
    "If a change genuinely doesn't affect the brief, say so and stop.";
  process.stdout.write(JSON.stringify({ decision: "block", reason }));
}
process.exit(0);
