#!/usr/bin/env node
// Stamp a new sprint from the method template into work/. The one canonical
// intake step: Trello card -> 00_BRIEF -> the sprint runs from there.
//
//   node method/scripts/new-sprint.mjs <name> [--app web] [--kind feature|app]
//                                      [--title "card title"] [--desc "card body"]
//   node method/scripts/new-sprint.mjs --self-test
//
// Private tooling: writes into gitignored work/, never ships to a client.
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import assert from "node:assert/strict";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Fill the brief file(s): substitute the known tokens, then neutralize every
// remaining bare <placeholder> to plain TODO text so the stamped brief can't
// break the VitePress build (bare <...> is parsed as markup).
function fillBriefs(dir, { name, slug, title, desc }) {
  const map = {
    "<feature>": name,
    "<project>": name,
    "<gstack slug>": slug,
    "<slug>": slug,
    "<feature-branch>": `feat/${slug}`,
  };
  if (title) map["<what done looks like>"] = title;
  if (desc) map["<why it matters>"] = desc;

  for (const file of [
    "BRIEF.md",
    "BUSINESS.md",
    "PROJECT-BRIEF.md",
    "UNIT-ECONOMICS.md",
  ]) {
    const path = join(dir, "00_BRIEF", file);
    if (!existsSync(path)) continue;
    let text = readFileSync(path, "utf8");
    for (const [token, value] of Object.entries(map))
      text = text.split(token).join(value);
    text = text.replace(/<([^>\n]+)>/g, "TODO — $1"); // build-safe leftover placeholders
    writeFileSync(path, text);
  }
}

function stamp({ kind, targetDir, name, slug, title, desc }) {
  const templateDir = join(ROOT, "method", "shared", "templates", kind);
  if (!existsSync(templateDir))
    throw new Error(`unknown --kind "${kind}" (${templateDir} missing)`);
  const guard = kind === "app" ? join(targetDir, "00_BRIEF") : targetDir;
  if (existsSync(guard)) throw new Error(`already stamped: ${guard}`);
  cpSync(templateDir, targetDir, { recursive: true });
  fillBriefs(targetDir, { name, slug, title, desc });
}

function parse(argv) {
  const opts = { app: "web", kind: "feature" };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--self-test") opts.selfTest = true;
    else if (a === "--app") opts.app = argv[++i];
    else if (a === "--kind") opts.kind = argv[++i];
    else if (a === "--title") opts.title = argv[++i];
    else if (a === "--desc") opts.desc = argv[++i];
    else rest.push(a);
  }
  opts.name = rest[0];
  return opts;
}

function selfTest() {
  const tmp = mkdtempSync(join(tmpdir(), "sprint-"));
  try {
    const targetDir = join(tmp, "2026-01-01_demo");
    stamp({
      kind: "feature",
      targetDir,
      name: "Demo Thing",
      slug: "demo",
      title: "Ship X",
      desc: "Users need X",
    });
    const brief = readFileSync(join(targetDir, "00_BRIEF", "BRIEF.md"), "utf8");
    assert.ok(existsSync(join(targetDir, "09_OUTPUTS")), "stage tree copied");
    assert.ok(brief.includes("Demo Thing"), "name substituted");
    assert.ok(brief.includes("feat/demo"), "branch substituted");
    assert.ok(
      brief.includes("Ship X") && brief.includes("Users need X"),
      "title/desc filled",
    );
    assert.ok(
      !/<[^>\n]+>/.test(brief),
      "no bare <placeholder> left (build-safe)",
    );
    assert.throws(
      () => stamp({ kind: "feature", targetDir, name: "x", slug: "x" }),
      /already stamped/,
    );
    console.log("self-test ok");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

function main() {
  const o = parse(process.argv.slice(2));
  if (o.selfTest) return selfTest();
  if (!o.name) {
    console.error(
      "usage: node method/scripts/new-sprint.mjs <name> [--app web] [--kind feature|app] [--title …] [--desc …]",
    );
    process.exit(1);
  }
  const slug = slugify(o.name);
  const date = new Date().toISOString().slice(0, 10);
  const targetDir =
    o.kind === "app"
      ? join(ROOT, "work", "apps", o.app)
      : join(ROOT, "work", "apps", o.app, "features", `${date}_${slug}`);

  stamp({
    kind: o.kind,
    targetDir,
    name: o.name,
    slug,
    title: o.title,
    desc: o.desc,
  });

  const rel = targetDir.replace(`${ROOT}/`, "");
  console.log(`stamped ${o.kind} sprint → ${rel}`);
  console.log(
    `next: finish ${rel}/00_BRIEF, then run /office-hours (02_THINK).`,
  );
  console.log(
    "reminder: fill the brief before `pnpm work:build` — leftover TODO lines are fine, bare <…> are not.",
  );
}

main();
