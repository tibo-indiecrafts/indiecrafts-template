import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT = fileURLToPath(new URL("./api-guards.mjs", import.meta.url));

/** Run the check with API_GUARDS_ROOT set to a throwaway tree of {relPath: source}. */
function runWith(files) {
  const root = mkdtempSync(join(tmpdir(), "apiguard-"));
  try {
    for (const [rel, src] of Object.entries(files)) {
      const full = join(root, rel);
      mkdirSync(join(full, ".."), { recursive: true });
      writeFileSync(full, src);
    }
    execFileSync("node", [SCRIPT], { env: { ...process.env, API_GUARDS_ROOT: root }, stdio: "pipe" });
    return { ok: true, stderr: "" };
  } catch (e) {
    return { ok: false, stderr: String(e.stderr ?? "") };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("real repo tree passes (every mutating route is guarded or allowlisted)", () => {
  // No API_GUARDS_ROOT → scans code/projects. Exits 0 or throws.
  execFileSync("node", [SCRIPT], { stdio: "pipe" });
});

test("a mutating route without withGuard and not allowlisted fails", () => {
  const r = runWith({
    "app/api/thing/route.ts": `export async function POST(req) { return new Response("ok"); }`,
  });
  assert.equal(r.ok, false);
  assert.match(r.stderr, /api\/thing\/route\.ts exports a mutating handler/);
});

test("a mutating route wrapped in withGuard passes", () => {
  const r = runWith({
    "app/api/thing/route.ts": `import { withGuard } from "@indiecrafts/security/guard";
const h = withGuard(async () => new Response("ok"));
export async function POST(req) { return h(req); }`,
  });
  assert.equal(r.ok, true);
});

test("a GET-only route is exempt", () => {
  const r = runWith({
    "app/api/thing/route.ts": `export async function GET(req) { return new Response("ok"); }`,
  });
  assert.equal(r.ok, true);
});

test("export-const handler form is detected", () => {
  const r = runWith({
    "app/api/thing/route.ts": `export const POST = async (req) => new Response("ok");`,
  });
  assert.equal(r.ok, false);
  assert.match(r.stderr, /mutating handler/);
});
