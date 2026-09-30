#!/usr/bin/env node
// Guards the instruction cascade — briefs (CLAUDE.md · AGENTS.md) + rules (.claude/rules/**.md) —
// so it can grow session by session without outgrowing what Claude Code loads well.
// HARD-FAILS (exit 1) on:
//   1. COMMAND — a `pnpm <script>` cited in a brief/rule (inside code/backticks) that resolves to no
//      script: not a root script, not a script of the named --filter package, and not a script of the
//      file's nearest package. Templated commands (`deploy:x:<env>`) are matched as a prefix.
//   2. SIZE    — a file over CEILING_LINES counting its `@imports`: imports expand at launch, so they
//      cost context like inline text. 200 is the official per-file target (code.claude.com/docs/en/memory).
//   3. IMPORT  — an `@path` import whose file does not exist (Claude Code drops it silently). Backtick a
//      mention (`@scope/pkg`) to keep it literal.
//   4. PLACE   — a commands/ or agents/ dir under code/**/.claude/ (Claude Code loads those from the
//      repo-root .claude/ only). Nested skills/ are fine: they load when Claude works in that folder.
// WARNS (never fails) on:
//   5. BLOAT   — a file's own text over MAP_LINES. A brief is a MAP; move procedures to a skill,
//      file-type detail to a `paths:`-scoped rule, reference to code/docs/.
// Block-level HTML comments are stripped before loading, so they count toward nothing.
//
// Run: `pnpm check:claude-md` (from the repo root; wired into `pnpm verify`).
// CLAUDE_MD_ROOT overrides the repo root (a fixture tree) for tests.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO =
  process.env.CLAUDE_MD_ROOT ||
  join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const MAP_LINES = 90; // the compactness clause — a brief is a MAP; keep it lean.
const CEILING_LINES = 200; // the hard ceiling, imports included.
const MAX_IMPORT_DEPTH = 4; // Claude Code follows imports four hops deep.
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
  if (!existsSync(dir)) return;
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
const scriptsByDir = new Map([[REPO, rootScripts]]);
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

// collect briefs + rules
const briefs = [];
const isRule = (p) => /\/\.claude\/rules\/.+\.md$/.test(p);
walk(join(REPO, "code"), (p) => {
  if (p.endsWith("/CLAUDE.md") || p.endsWith("/AGENTS.md") || isRule(p))
    briefs.push(p);
});
walk(
  join(REPO, ".claude", "rules"),
  (p) => p.endsWith(".md") && briefs.push(p),
);
for (const f of ["CLAUDE.md", "AGENTS.md", ".claude/CLAUDE.md"])
  if (existsSync(join(REPO, f))) briefs.push(join(REPO, f));

const errors = [];
const warnings = [];
const rel = (p) => p.slice(REPO.length + 1);
const loaded = (text) => text.replace(/<!--[\s\S]*?-->/g, "");
const countLines = (text) => text.replace(/\n+$/, "").split("\n").length;
// only look at code spans (inline `...` + fenced ```...```), never prose
const codeSpans = (text) =>
  [
    ...(text.match(/`[^`\n]+`/g) || []),
    ...(text.match(/```[\s\S]*?```/g) || []),
  ].join("\n");
const prose = (text) =>
  text.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]+`/g, "");
const CMD = /pnpm\s+((?:--filter|-F)\s+(\S+)\s+)?(?:run\s+)?([a-z][\w:-]*)/g;
// `@path` at a word start, path-shaped (has a `.` or `/`); trailing punctuation is prose, not path.
const IMPORT = /(?:^|\s)@([^\s`]*[./][^\s`]*)/gm;
const importsOf = (file, text) =>
  [...prose(text).matchAll(IMPORT)].map((m) => {
    const raw = m[1].replace(/[.,;:)\]]+$/, "");
    const target = raw.startsWith("~/")
      ? join(process.env.HOME ?? "", raw.slice(2))
      : resolve(dirname(file), raw);
    return { raw, target };
  });

// lines Claude Code loads for `file`: its own text plus every import, four hops deep
function effectiveLines(file, depth = 0, seen = new Set()) {
  if (seen.has(file) || depth > MAX_IMPORT_DEPTH) return 0;
  seen.add(file);
  const text = loaded(readFileSync(file, "utf8"));
  let total = countLines(text);
  for (const { target } of importsOf(file, text))
    if (existsSync(target) && statSync(target).isFile())
      total += effectiveLines(target, depth + 1, seen);
  return total;
}

for (const b of briefs) {
  const text = loaded(readFileSync(b, "utf8"));
  const own = countLines(text);
  if (own > MAP_LINES)
    warnings.push(
      `BLOAT   ${rel(b)}: ${own} lines > ${MAP_LINES} — trim toward a map (compactness clause).`,
    );

  for (const { raw, target } of importsOf(b, text))
    if (!existsSync(target))
      errors.push(
        `IMPORT  ${rel(b)}: @${raw} — no such file (backtick it if it is a mention, not an import).`,
      );

  const total = effectiveLines(b);
  if (total > CEILING_LINES)
    errors.push(
      `SIZE    ${rel(b)}: ${total} lines with imports > ${CEILING_LINES} — move detail to a skill, a paths:-scoped rule, or code/docs/.`,
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

// misplaced root-only dirs under code/**/.claude/
for (const kind of ["commands", "agents"]) {
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
  if (existsSync(join(REPO, "code"))) scan(join(REPO, "code"));
}

for (const w of warnings) console.warn(`  ⚠ ${w}`);
if (errors.length) {
  console.error(`✖ check:claude-md — ${errors.length} error(s):`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log(
  `✓ check:claude-md — ${briefs.length} briefs + rules: commands + imports resolve, ≤ ${CEILING_LINES} lines with imports, no misplaced dirs` +
    (warnings.length
      ? ` (${warnings.length} bloat warning(s) above)`
      : ` (all within the ${MAP_LINES}-line map budget)`),
);
