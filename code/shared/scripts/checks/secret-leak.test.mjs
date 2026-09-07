import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT = fileURLToPath(new URL("./secret-leak.mjs", import.meta.url));

// Built by concatenation so this test file never contains a contiguous
// `<public-prefix><secret>` literal — the repo's own write-guard hook (and this very
// check, which skips scripts/) would otherwise flag the test source itself.
const NEXT = "NEXT_PUBLIC_";
const EXPO = "EXPO_PUBLIC_";
const VITE = "VITE_";

/** Run the check with SECRET_LEAK_ROOT set to a throwaway tree of {relPath: source}. */
function runWith(files) {
  const root = mkdtempSync(join(tmpdir(), "secretleak-"));
  try {
    for (const [rel, src] of Object.entries(files)) {
      const full = join(root, rel);
      mkdirSync(join(full, ".."), { recursive: true });
      writeFileSync(full, src);
    }
    execFileSync("node", [SCRIPT], {
      env: { ...process.env, SECRET_LEAK_ROOT: root },
      stdio: "pipe",
    });
    return { ok: true, stderr: "" };
  } catch (e) {
    return { ok: false, stderr: String(e.stderr ?? "") };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("real repo tree passes (no documented secret sits under a public prefix)", () => {
  // No SECRET_LEAK_ROOT → scans code/. Exits 0 or throws.
  execFileSync("node", [SCRIPT], { stdio: "pipe" });
});

test("a documented secret used under a public prefix fails", () => {
  const r = runWith({
    "worker/.dev.vars.example": `CLERK_SECRET_KEY=`,
    "app/src/x.ts": `const k = process.env.${NEXT}CLERK_SECRET_KEY;`,
  });
  assert.equal(r.ok, false);
  assert.match(
    r.stderr,
    new RegExp(`${NEXT}CLERK_SECRET_KEY.*public build prefix`),
  );
});

test("the same secret read server-side (no prefix) passes", () => {
  const r = runWith({
    "worker/.dev.vars.example": `CLERK_SECRET_KEY=`,
    "app/src/x.ts": `const k = process.env.CLERK_SECRET_KEY;`,
  });
  assert.equal(r.ok, true);
});

test("a documented public bundle-gate token is allowlisted", () => {
  // AGENT_TOKEN is a server secret, but EXPO_PUBLIC_AGENT_TOKEN is a documented public
  // bundle value — using it must NOT trip the guard.
  const r = runWith({
    "worker/.dev.vars.example": `AGENT_TOKEN=`,
    "mobile/.env.example": `${EXPO}AGENT_TOKEN=`,
    "mobile/src/agent.ts": `const t = process.env.${EXPO}AGENT_TOKEN;`,
  });
  assert.equal(r.ok, true);
});

test("a public config var (URL) is not treated as a secret", () => {
  const r = runWith({
    "worker/.dev.vars.example": `API_URL=`,
    "app/src/x.ts": `const u = process.env.${VITE}API_URL;`,
  });
  assert.equal(r.ok, true);
});
