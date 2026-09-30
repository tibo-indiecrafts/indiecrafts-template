import assert from "node:assert/strict";
import { test } from "node:test";
import { spawnSync } from "node:child_process";
import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT = fileURLToPath(new URL("./bindings.mjs", import.meta.url));

// Run bindings.mjs against a fake `pnpm` that records its argv (no Cloudflare call).
function run(...args) {
  const bin = mkdtempSync(join(tmpdir(), "bindings-test-"));
  const log = join(bin, "argv");
  writeFileSync(
    join(bin, "pnpm"),
    `#!/bin/sh\necho "$@" > "${log}"\necho 'database_id = "abc"'\necho 'id = "abc"'\n`,
  );
  chmodSync(join(bin, "pnpm"), 0o755);
  const r = spawnSync(process.execPath, [SCRIPT, ...args], {
    encoding: "utf8",
    env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
  });
  return { status: r.status, argv: readFileSync(log, "utf8").trim() };
}

// D1's region is fixed at creation and cannot move. The GDPR design keeps both D1s in the
// EU, so every database this helper creates is pinned to Western Europe.
test("a D1 is created in the EU (--location weur)", () => {
  const { status, argv } = run("api", "dev", "d1", "AUDIT_DB");
  assert.equal(status, 0);
  assert.match(argv, /wrangler d1 create \S+ --location weur$/);
});

test("KV and queues take no location flag", () => {
  assert.doesNotMatch(run("api", "dev", "queue", "JOBS").argv, /--location/);
});
