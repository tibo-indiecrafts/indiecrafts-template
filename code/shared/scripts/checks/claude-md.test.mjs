import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT = fileURLToPath(new URL("./claude-md.mjs", import.meta.url));
const lines = (n) =>
  Array.from({ length: n }, (_, i) => `line ${i + 1}`).join("\n");

/** Run the check with CLAUDE_MD_ROOT set to a throwaway repo of {relPath: source}. */
function runWith(files) {
  const root = mkdtempSync(join(tmpdir(), "claudemd-"));
  try {
    const tree = { "package.json": '{"scripts":{"verify":"x"}}', ...files };
    for (const [rel, src] of Object.entries(tree)) {
      mkdirSync(dirname(join(root, rel)), { recursive: true });
      writeFileSync(join(root, rel), src);
    }
    const r = spawnSync("node", [SCRIPT], {
      env: { ...process.env, CLAUDE_MD_ROOT: root },
      encoding: "utf8",
    });
    return { ok: r.status === 0, out: `${r.stdout}${r.stderr}` };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// Integration guard: the repo's own briefs + rules must pass.
test("check:claude-md passes on the repo", () => {
  const out = execFileSync("node", [SCRIPT], { encoding: "utf8" });
  assert.match(out, /✓ check:claude-md/);
});

test("a brief over the map budget warns but passes", () => {
  const r = runWith({ "code/a/.claude/CLAUDE.md": lines(120) });
  assert.ok(r.ok, r.out);
  assert.match(r.out, /BLOAT/);
});

test("a brief over the 200-line ceiling fails", () => {
  const r = runWith({ "code/a/.claude/CLAUDE.md": lines(210) });
  assert.ok(!r.ok);
  assert.match(r.out, /SIZE .*code\/a\/\.claude\/CLAUDE\.md/);
});

test("@imports count toward the ceiling (they load at launch)", () => {
  const r = runWith({
    "code/a/.claude/CLAUDE.md": `# a\n\nSee @../DESIGN.md for tokens.\n`,
    "code/a/DESIGN.md": lines(250),
  });
  assert.ok(!r.ok);
  assert.match(r.out, /SIZE .*CLAUDE\.md: \d+ lines with imports/);
});

test("a backticked @path is a mention, not an import", () => {
  const r = runWith({
    "code/a/.claude/CLAUDE.md": "# a\n\nTokens: `@../DESIGN.md`.\n",
    "code/a/DESIGN.md": lines(250),
  });
  assert.ok(r.ok, r.out);
});

test("an @import of a missing file fails", () => {
  const r = runWith({
    "code/a/.claude/CLAUDE.md": "# a\n\nSee @../GONE.md.\n",
  });
  assert.ok(!r.ok);
  assert.match(r.out, /IMPORT .*@\.\.\/GONE\.md/);
});

test("HTML comments cost nothing (stripped before loading)", () => {
  const r = runWith({
    "code/a/.claude/CLAUDE.md": `# a\n<!--\n${lines(250)}\n-->\n`,
  });
  assert.ok(r.ok, r.out);
});

test("rules are covered: an oversized nested rule fails", () => {
  const r = runWith({ "code/a/.claude/rules/big.md": lines(210) });
  assert.ok(!r.ok);
  assert.match(r.out, /SIZE .*rules\/big\.md/);
});

test("rules are covered: a rule citing a missing pnpm script fails", () => {
  const r = runWith({
    ".claude/rules/x.md": "Run `pnpm nope:script` first.\n",
  });
  assert.ok(!r.ok);
  assert.match(r.out, /COMMAND .*nope:script/);
});

test("nested skills are allowed (Claude Code loads them on demand)", () => {
  const r = runWith({
    "code/a/.claude/skills/s/SKILL.md": "---\nname: s\n---\n",
  });
  assert.ok(r.ok, r.out);
});

test("nested agents/ and commands/ fail (root-only)", () => {
  const a = runWith({ "code/a/.claude/agents/x.md": "x" });
  const c = runWith({ "code/a/.claude/commands/x.md": "x" });
  assert.ok(!a.ok && /PLACE .*agents/.test(a.out), a.out);
  assert.ok(!c.ok && /PLACE .*commands/.test(c.out), c.out);
});
