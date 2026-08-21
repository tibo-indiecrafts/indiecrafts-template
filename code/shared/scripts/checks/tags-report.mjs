#!/usr/bin/env node
// Issue-tag report — inventory + validate the @complexity/@refactor/@debt tags.
// Canonical vocabulary: .claude/rules/issue-tags.md.
//
//   node scripts/tags-report.mjs            # full report
//   node scripts/tags-report.mjs --check    # CI: exit 1 on non-canonical tags
//   node scripts/tags-report.mjs --debt     # filter to one family
//
// Wired as `pnpm tags:report` / `pnpm tags:check`.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, basename, extname } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["code", "docs"];
const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  ".turbo",
  "dist",
  "build",
  "out",
  ".vitepress",
]);
// Scans code AND docs (`.md`): tags live in code comments and, for visibility, in a
// doc's `## Issue tags` footer (mirroring real gaps). The vocabulary-defining /
// illustrating docs are excluded via SKIP_FILES so their example tokens aren't counted.
const EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".css",
  ".scss",
  ".sql",
  ".sh",
  ".md",
]);
// Docs that DEFINE, illustrate, or narrate tags — their tokens are examples/history, not
// real flags — so exclude them from the scan (matched by basename). CHANGELOG.md entries
// describe tag-related changes in prose; a live flag lives in code or a doc footer.
const SKIP_FILES = new Set(["issue-tags.md", "scripts.md", "CHANGELOG.md"]);
// Test files carry deliberately-bad example tags in fixtures (e.g. the tag scanner's own
// test) — never a real flag. Skip them by name.
const isTestFile = (name) => /\.(test|spec)\.[cm]?[jt]sx?$/.test(name);

// Canonical vocabulary (mirror of .claude/rules/issue-tags.md).
const CANON = {
  complexity: ["LOW", "MEDIUM", "HIGH"],
  refactor: [
    "SPLIT",
    "EXTRACT",
    "CONSOLIDATE",
    "COLOCATE",
    "SIMPLIFY",
    "RENAME",
    "DUPLICATE",
    "TYPES",
    "BARREL",
  ],
  debt: [
    "PERFORMANCE",
    "SECURITY",
    "TESTING",
    "E2E",
    "HARDCODED",
    "COUPLING",
    "DEPRECATED",
    "VESTIGIAL",
    "MIGRATION",
    "BACKWARD_COMPAT",
    "ACCESSIBILITY",
    "LOGGING",
  ],
  bug: null, // no qualifier
  optimisation: null,
};

const args = process.argv.slice(2);
const check = args.includes("--check");
const filter = args
  .find((a) => a.startsWith("--") && a !== "--check")
  ?.slice(2);

const TOKEN_RE =
  /@(complexity|refactor|debt)\s+([A-Z0-9_]+)|@(bug|optimisation)\b/g;

function walk(dir, out) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.name.startsWith(".") && e.name !== ".claude") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(p, out);
    } else if (
      EXT.has(extname(e.name)) &&
      !SKIP_FILES.has(basename(e.name)) &&
      !isTestFile(e.name)
    ) {
      out.push(p);
    }
  }
}

const files = [];
for (const d of SCAN_DIRS) {
  const abs = join(ROOT, d);
  try {
    if (statSync(abs).isDirectory()) walk(abs, files);
  } catch {
    /* dir absent — skip */
  }
}

const counts = new Map(); // "family QUALIFIER" -> n
const nonCanon = new Map(); // token -> n
for (const file of files) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  for (const m of text.matchAll(TOKEN_RE)) {
    const family = m[1] ?? m[3];
    const qual = m[2] ?? null;
    const token = qual ? `@${family} ${qual}` : `@${family}`;
    counts.set(token, (counts.get(token) ?? 0) + 1);
    const allowed = CANON[family];
    const ok = allowed === null ? qual === null : allowed?.includes(qual);
    if (!ok) nonCanon.set(token, (nonCanon.get(token) ?? 0) + 1);
  }
}

const families = ["complexity", "refactor", "debt", "bug", "optimisation"];

if (filter && families.includes(filter)) {
  const rows = [...counts]
    .filter(([t]) => t.startsWith(`@${filter}`))
    .sort((a, b) => b[1] - a[1]);
  console.log(`Tags for @${filter}:`);
  if (rows.length === 0) console.log("  (none)");
  for (const [t, n] of rows) console.log(`  ${String(n).padStart(4)}  ${t}`);
  process.exit(0);
}

console.log(`=== Issue-tag inventory ===  (scanned ${files.length} files)`);
const sorted = [...counts].sort((a, b) => b[1] - a[1]);
if (sorted.length === 0) console.log("  (no tags found)");
for (const [t, n] of sorted) console.log(`  ${String(n).padStart(4)}  ${t}`);

console.log("\n=== Totals by family ===");
for (const fam of families) {
  const n = [...counts]
    .filter(([t]) => t.startsWith(`@${fam}`))
    .reduce((s, [, c]) => s + c, 0);
  console.log(`  @${fam.padEnd(13)} ${n}`);
}

if (nonCanon.size > 0) {
  console.log("\n=== Non-canonical tags (fix, or add to the vocabulary) ===");
  for (const [t, n] of [...nonCanon].sort((a, b) => b[1] - a[1]))
    console.log(`  ${String(n).padStart(4)}  ${t}`);
  if (check) {
    console.error("\ntags:check failed — non-canonical tags present.");
    process.exit(1);
  }
} else {
  console.log("\nAll tags use the canonical vocabulary.");
}
