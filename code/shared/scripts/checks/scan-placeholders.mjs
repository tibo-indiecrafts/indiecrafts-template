// Pre-handoff scan: catch leftover template scaffolding in the SHIPPED tree
// (code/ + docs/) before a client site goes out. The internal method/ + work/
// folders legitimately hold placeholders, so they are not scanned.
//
//   pnpm scan:placeholders            # report (always exit 0)
//   pnpm scan:placeholders -- --strict   # exit 1 if any HARD placeholder remains
//
// HARD = must never ship (unfilled env, template tokens, lorem).
// SOFT = worth a look, not blocking (TODO/FIXME/example.com).

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, basename } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["code", "docs"];
const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".turbo",
  "dist",
  "build",
  "out",
  ".vitepress",
  "storybook-static",
]);
const EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".md",
  ".mdx",
  ".json",
  ".css",
  ".txt",
  ".html",
]);
// Files that legitimately contain placeholders.
const SKIP_FILES = new Set([
  ".env.example",
  "generated.ts",
  "scan-placeholders.mjs",
]);

const HARD = [
  { re: /\byour_[A-Z0-9_]+_here\b/i, what: "unfilled env placeholder" },
  {
    re: /<production URL>|<git URL>|<Netlify\/Vercel dashboard>|<your-component-library>/,
    what: "template token",
  },
  { re: /\b(CHANGEME|REPLACE_ME|INSERT_[A-Z_]+)\b/, what: "replace-me marker" },
  { re: /lorem ipsum/i, what: "lorem placeholder copy" },
];
const SOFT = [
  { re: /\bTODO\b|\bFIXME\b/, what: "TODO/FIXME" },
  { re: /\bexample\.com\b/, what: "example.com" },
];

const strict = process.argv.includes("--strict");

function walk(dir, out) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.name.startsWith(".") && e.name !== ".env.example") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(p, out);
    } else if (EXT.has(extname(e.name)) && !SKIP_FILES.has(basename(e.name))) {
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
    /* absent */
  }
}

const hits = { hard: [], soft: [] };
for (const file of files) {
  let lines;
  try {
    lines = readFileSync(file, "utf8").split("\n");
  } catch {
    continue;
  }
  lines.forEach((line, i) => {
    for (const { re, what } of HARD)
      if (re.test(line))
        hits.hard.push({
          file,
          line: i + 1,
          what,
          text: line.trim().slice(0, 100),
        });
    for (const { re, what } of SOFT)
      if (re.test(line))
        hits.soft.push({
          file,
          line: i + 1,
          what,
          text: line.trim().slice(0, 100),
        });
  });
}

const rel = (f) => f.replace(ROOT + "/", "");
function report(title, list) {
  console.log(`\n${title} (${list.length})`);
  for (const h of list)
    console.log(`  ${rel(h.file)}:${h.line}  [${h.what}]  ${h.text}`);
}

console.log(`Scanned ${files.length} files in code/ + docs/`);
report("HARD — must not ship", hits.hard);
report("SOFT — review", hits.soft);

if (hits.hard.length === 0 && hits.soft.length === 0)
  console.log("\n✓ No placeholders found.");
if (strict && hits.hard.length > 0) {
  console.error(
    `\n✗ --strict: ${hits.hard.length} hard placeholder(s) remain.`,
  );
  process.exit(1);
}
