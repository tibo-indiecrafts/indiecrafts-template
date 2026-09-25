#!/usr/bin/env node
// Guards the CLAUDE.md brief cascade — the "right instructions in the right place" check.
// HARD-FAILS (exit 1) on:
//   1. COMMAND DRIFT  — a `pnpm <script>` cited in a brief (inside code/backticks) that resolves
//      to no script: not a root script, not a script of the named --filter package, and not a
//      script of the brief's own nearest package. Templated commands (`deploy:x:<env>`) are
//      matched as a prefix.
//   2. MISPLACEMENT   — a commands/ · skills/ · agents/ dir nested under a code/**/.claude/
//      (Claude Code loads those from the repo-root .claude/ only, so a nested one is dead).
// WARNS (never fails) on:
//   3. BLOAT          — a brief over the compact line budget. Briefs are MAPS, not manuals.
//
// Run: `pnpm check:claude-md` (from the repo root; wired into `pnpm verify`).
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
  "..",
);
const BRIEF_MAX_LINES = 90; // the compactness clause — a brief is a MAP; keep it lean.
const SKIP = new Set([
  "node_modules",
  ".git",
  "dist",
  ".next",
  ".open-next",
  ".wrangler",
  ".sanity",
  "worktrees",
]);
const PNPM_BUILTINS = new Set([
  "install",
  "i",
  "add",
  "remove",
  "rm",
  "up",
  "update",
  "dlx",
  "exec",
  "create",
  "why",
  "list",
  "ls",
  "dedupe",
  "prune",
  "store",
  "run",
  "test",
  "publish",
  "pack",
  "link",
  "import",
  "audit",
]);

function walk(dir, hit) {
  for (const e of readdirSync(dir)) {
    if (SKIP.has(e) || (e.startsWith(".") && e !== ".claude")) continue;
    const p = join(dir, e);
    statSync(p).isDirectory() ? walk(p, hit) : hit(p);
  }
}

// package.json scripts: root + every unit (by package name) + by directory (nearest lookup)
const rootScripts = new Set(
  Object.keys(
    JSON.parse(readFileSync(join(REPO, "package.json"), "utf8")).scripts || {},
  ),
);
const pkgScriptsByName = new Map();
const scriptsByDir = new Map();
walk(join(REPO, "code"), (p) => {
  if (!p.endsWith("/package.json")) return;
  try {
    const j = JSON.parse(readFileSync(p, "utf8"));
    const set = new Set(Object.keys(j.scripts || {}));
    if (j.name) pkgScriptsByName.set(j.name, set);
    scriptsByDir.set(dirname(p), set);
  } catch {}
});
// nearest package scripts for a file: walk up to the first dir with a package.json
function nearestScripts(file) {
  let d = dirname(file);
  while (d.startsWith(REPO)) {
    if (scriptsByDir.has(d)) return scriptsByDir.get(d);
    d = dirname(d);
  }
  return new Set();
}
const resolves = (set, script) =>
  script.endsWith(":")
    ? [...set].some((s) => s.startsWith(script))
    : set.has(script);

// collect briefs
const briefs = [];
walk(join(REPO, "code"), (p) => {
  if (p.endsWith("/CLAUDE.md") || p.endsWith("/AGENTS.md")) briefs.push(p);
});
if (existsSync(join(REPO, "CLAUDE.md"))) briefs.push(join(REPO, "CLAUDE.md"));

const errors = [];
const warnings = [];
const rel = (p) => p.slice(REPO.length + 1);
// only look at code spans (inline `...` + fenced ```...```), never prose
const codeSpans = (text) =>
  [
    ...(text.match(/`[^`\n]+`/g) || []),
    ...(text.match(/```[\s\S]*?```/g) || []),
  ].join("\n");
const CMD = /pnpm\s+((?:--filter|-F)\s+(\S+)\s+)?(?:run\s+)?([a-z][\w:-]*)/g;

for (const b of briefs) {
  const text = readFileSync(b, "utf8");
  const isPointer = text.trim().startsWith("@");
  const lines = text.split("\n").length;
  if (!isPointer && lines > BRIEF_MAX_LINES)
    warnings.push(
      `BLOAT   ${rel(b)}: ${lines} lines > ${BRIEF_MAX_LINES} — trim toward a map (compactness clause).`,
    );

  const near = nearestScripts(b);
  for (const m of codeSpans(text).matchAll(CMD)) {
    const filterPkg = m[2];
    const script = m[3];
    if (PNPM_BUILTINS.has(script)) continue;
    if (filterPkg) {
      const set = pkgScriptsByName.get(filterPkg);
      if (set && !resolves(set, script))
        errors.push(
          `COMMAND ${rel(b)}: \`pnpm --filter ${filterPkg} ${script}\` — no such script in ${filterPkg}.`,
        );
    } else if (!resolves(rootScripts, script) && !resolves(near, script)) {
      errors.push(
        `COMMAND ${rel(b)}: \`pnpm ${script}\` — no such root or nearest-package script.`,
      );
    }
  }
}

// misplaced toolkit dirs under code/**/.claude/
for (const kind of ["commands", "skills", "agents"]) {
  const scan = (dir) => {
    for (const e of readdirSync(dir)) {
      if (SKIP.has(e)) continue;
      const p = join(dir, e);
      if (!statSync(p).isDirectory()) continue;
      if (e === kind && dirname(p).endsWith("/.claude"))
        errors.push(
          `PLACE   ${rel(p)}: nested .claude/${kind}/ — Claude Code loads ${kind} from the repo-root .claude/ only.`,
        );
      else scan(p);
    }
  };
  scan(join(REPO, "code"));
}

for (const w of warnings) console.warn(`  ⚠ ${w}`);
if (errors.length) {
  console.error(`✖ check:claude-md — ${errors.length} error(s):`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log(
  `✓ check:claude-md — ${briefs.length} briefs: commands resolve, no misplaced toolkit dirs` +
    (warnings.length
      ? ` (${warnings.length} bloat warning(s) above)`
      : ` (all within the ${BRIEF_MAX_LINES}-line budget)`),
);
