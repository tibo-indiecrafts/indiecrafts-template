// Guard for tags-report.mjs — now that it spans code AND docs (`.md`), lock in the
// two behaviors the doc-scanning added: real doc tags count, vocabulary/meta docs are
// skipped, and --check still fails on a non-canonical qualifier.
//
//   node --test scripts/tags-report.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "tags-report.mjs");

// The scanner uses process.cwd() as its root and scans code/ docs/ method/. Build a
// throwaway repo root with just a docs/ tree and run the real script against it.
function fixture(files) {
  const root = mkdtempSync(join(tmpdir(), "tags-"));
  for (const [rel, content] of Object.entries(files)) {
    const abs = join(root, rel);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, content);
  }
  return root;
}
function run(root, args = []) {
  return spawnSync("node", [SCRIPT, ...args], { cwd: root, encoding: "utf8" });
}

test("counts a tag in a doc footer (.md is scanned)", () => {
  const root = fixture({
    "docs/guide.md": "## Issue tags\n\n- `@debt COUPLING` — real gap.\n",
  });
  try {
    const { stdout, status } = run(root);
    assert.equal(status, 0);
    assert.match(stdout, /@debt COUPLING/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("skips the vocabulary/meta docs (issue-tags.md, scripts.md)", () => {
  const root = fixture({
    "docs/issue-tags.md": "- `@debt SECURITY` vocabulary example\n",
    "docs/scripts.md": "`@refactor SPLIT` command example\n",
    "docs/real.md": "## Issue tags\n\n- `@debt TESTING` — real.\n",
  });
  try {
    const { stdout } = run(root);
    assert.match(stdout, /@debt TESTING/); // the real one counts
    assert.doesNotMatch(stdout, /@debt SECURITY/); // issue-tags.md is skipped
    assert.doesNotMatch(stdout, /@refactor SPLIT/); // scripts.md is skipped
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("--check fails on a non-canonical qualifier", () => {
  const root = fixture({
    "docs/bad.md": "- `@debt BACKWARD` (canonical is BACKWARD_COMPAT)\n",
  });
  try {
    assert.equal(run(root, ["--check"]).status, 1);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("--check passes on a clean canonical set", () => {
  const root = fixture({
    "docs/ok.md": "- `@debt COUPLING`\n- `@complexity HIGH`\n",
  });
  try {
    assert.equal(run(root, ["--check"]).status, 0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
