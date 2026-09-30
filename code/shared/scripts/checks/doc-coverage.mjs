#!/usr/bin/env node
// Doc coverage: assert every code UNIT (package · module · surface · service)
// has a documentation page in code/docs/. This is the enforced "all units
// documented" gate — it fails (exit 1) on any unit with no page.
//
// File-level coverage (a doc per source file) is the tracked next target; this
// script prints the source-file counts as context but does not fail on them.
//
// Run: `pnpm check:doc-coverage` (from the repo root).
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
  "..",
);
const CODE = join(REPO, "code");
const DOCS = join(CODE, "docs");

const dirs = (p) =>
  existsSync(p)
    ? readdirSync(p).filter(
        (n) => !n.startsWith("_") && statSync(join(p, n)).isDirectory(),
      )
    : [];
// a unit is a dir with a package.json — a leftover folder of ignored files (node_modules, .turbo)
// after a package is deleted or a branch switch is not a unit
const unitDirs = (p) =>
  dirs(p).filter((n) => existsSync(join(p, n, "package.json")));
const doc = (...p) => join(DOCS, ...p);
const anyDoc = (...cands) => cands.some((c) => existsSync(c));

const missing = [];
const units = [];
function check(kind, id, ...docCandidates) {
  units.push(id);
  if (!anyDoc(...docCandidates)) missing.push(`${kind}: ${id}`);
}

// ---- packages: code/packages/<scope>/<name> -> docs/packages/<scope>/<name>.md ----
for (const scope of dirs(join(CODE, "packages")))
  for (const name of unitDirs(join(CODE, "packages", scope)))
    check(
      "package",
      `packages/${scope}/${name}`,
      doc("packages", scope, `${name}.md`),
    );

// ---- modules: code/modules/<scope>/<name> -> docs/modules/<scope>/<name>/(index|README).md ----
for (const scope of dirs(join(CODE, "modules")))
  for (const name of unitDirs(join(CODE, "modules", scope)))
    check(
      "module",
      `modules/${scope}/${name}`,
      doc("modules", scope, name, "index.md"),
      doc("modules", scope, name, "README.md"),
    );

// ---- surfaces (explicit: the live/scaffold deployables; reserved */shared/* are skipped) ----
check(
  "surface",
  "web/surfaces/website",
  doc("projects", "web", "website", "config", "feature-flags.md"),
);
check(
  "surface",
  "web/surfaces/admin",
  doc("projects", "web", "admin", "index.md"),
);
check("surface", "web/surfaces/app", doc("projects", "web", "app", "index.md"));
check(
  "surface",
  "web/tools/storybook",
  doc("projects", "web", "tools", "storybook.md"),
);
check(
  "surface",
  "mobile/surfaces/main",
  doc("projects", "mobile", "main", "index.md"),
);

// ---- shared services / ops ----
check("service", "shared/api", doc("shared", "api", "index.md"));
check("service", "shared/cron", doc("shared", "cron", "index.md"));
check("service", "shared/workers", doc("shared", "workers", "index.md"));
check(
  "service",
  "shared/db",
  doc("shared", "db", "README.md"),
  doc("shared", "db", "index.md"),
);
check(
  "service",
  "shared/infra",
  doc("shared", "infra", "README.md"),
  doc("shared", "infra", "index.md"),
);
check("service", "shared/scripts", doc("shared", "scripts", "index.md"));

// ---- per-file coverage: every source file has a page under docs/reference/ ----
const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  ".next",
  ".open-next",
  ".wrangler",
  ".sanity",
]);
const isSrc = (e) =>
  /\.(ts|tsx|mjs)$/.test(e) &&
  !/\.(test|spec|stories)\./.test(e) &&
  !/\.d\.ts$/.test(e);
function srcList(abs, rel, out) {
  if (!existsSync(abs)) return out;
  for (const e of readdirSync(abs)) {
    if (SKIP_DIRS.has(e) || e.startsWith(".")) continue;
    const a = join(abs, e);
    if (statSync(a).isDirectory()) srcList(a, `${rel}/${e}`, out);
    else if (isSrc(e)) out.push(`${rel}/${e}`);
  }
  return out;
}
// repo-relative source path -> its expected docs/reference/ page (absolute).
// Next.js dynamic segments ([locale], [...slug], [[...sign-in]]) are de-bracketed
// in doc paths so VitePress does not treat them as dynamic routes.
const debracket = (p) =>
  p
    .split("/")
    .map((s) =>
      s
        .replace(/\[/g, "")
        .replace(/\]/g, "")
        .replace(/^\.\.\./, ""),
    )
    .join("/");
function refPage(rel) {
  const d = debracket(
    rel
      .replace(/^code\//, "")
      .replace("projects/web/surfaces/", "projects/web/")
      .replace("projects/mobile/surfaces/", "projects/mobile/"),
  ).replace(/\.(ts|tsx|mjs)$/, ".md");
  return join(DOCS, "reference", d);
}
const SRC_ROOTS = [
  "code/packages",
  "code/modules",
  "code/shared/api",
  "code/shared/cron",
  "code/shared/workers",
  "code/projects/web/surfaces/website",
  "code/projects/web/surfaces/admin",
  "code/projects/web/surfaces/app",
  "code/projects/mobile/surfaces/main",
  "code/projects/web/tools/storybook",
];
const allSrc = [];
for (const r of SRC_ROOTS) srcList(join(REPO, r), r, allSrc);
const undoc = allSrc.filter((f) => !existsSync(refPage(f)));

console.log(
  `doc-coverage: ${units.length - missing.length}/${units.length} units documented; ` +
    `${allSrc.length - undoc.length}/${allSrc.length} source files have a reference page`,
);
if (missing.length) {
  console.error(`\n✖ ${missing.length} undocumented unit(s):`);
  for (const m of missing) console.error(`  - ${m}`);
  process.exit(1);
}
if (undoc.length) {
  console.error(
    `\n✖ ${undoc.length} source file(s) with no docs/reference/ page:`,
  );
  for (const f of undoc.slice(0, 40)) console.error(`  - ${f}`);
  if (undoc.length > 40) console.error(`  … and ${undoc.length - 40} more`);
  process.exit(1);
}
console.log("✓ every code unit and source file is documented");
