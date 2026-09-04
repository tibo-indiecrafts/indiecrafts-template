import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT = fileURLToPath(new URL("./typed-routing.mjs", import.meta.url));

/** Run the check with TYPED_ROUTING_ROOT set to a throwaway tree of {relPath: source}. */
function runWith(files) {
  const root = mkdtempSync(join(tmpdir(), "typedrouting-"));
  try {
    for (const [rel, src] of Object.entries(files)) {
      const full = join(root, rel);
      mkdirSync(join(full, ".."), { recursive: true });
      writeFileSync(full, src);
    }
    execFileSync("node", [SCRIPT], {
      env: { ...process.env, TYPED_ROUTING_ROOT: root },
      stdio: "pipe",
    });
    return { ok: true, stderr: "" };
  } catch (e) {
    return { ok: false, stderr: String(e.stderr ?? "") };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("real repo tree passes (no next-cf surface bypasses @/i18n/routing)", () => {
  // No TYPED_ROUTING_ROOT → scans the real website/admin/app surfaces. Exits 0 or throws.
  execFileSync("node", [SCRIPT], { stdio: "pipe" });
});

test("a component importing next/link fails", () => {
  const r = runWith({
    "components/Nav.tsx": `import Link from "next/link";\nexport const Nav = () => <Link href="/">home</Link>;`,
  });
  assert.equal(r.ok, false);
  assert.match(r.stderr, /components\/Nav\.tsx imports "next\/link"/);
});

test("a component importing next-intl/navigation fails", () => {
  const r = runWith({
    "lib/nav.ts": `import { redirect } from "next-intl/navigation";\nexport { redirect };`,
  });
  assert.equal(r.ok, false);
  assert.match(r.stderr, /next-intl\/navigation/);
});

test("importing from @/i18n/routing passes", () => {
  const r = runWith({
    "components/Nav.tsx": `import { Link } from "@/i18n/routing";\nexport const Nav = () => <Link href="/">home</Link>;`,
  });
  assert.equal(r.ok, true);
});

test("src/i18n/routing.ts is exempt (it creates the wrappers)", () => {
  const r = runWith({
    "src/i18n/routing.ts": `import { createNavigation } from "next-intl/navigation";\nexport const { Link } = createNavigation();`,
  });
  assert.equal(r.ok, true);
});

test("require() of a banned module is detected", () => {
  const r = runWith({
    "lib/legacy.js": `const Link = require("next/link");\nmodule.exports = Link;`,
  });
  assert.equal(r.ok, false);
  assert.match(r.stderr, /next\/link/);
});
