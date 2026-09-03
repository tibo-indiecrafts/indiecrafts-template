import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { INFRA } from "./infra-registry.mjs";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");

// `run.mjs` resolves each row's `dir` and runs `terraform -chdir=<dir>`; a registered stack
// whose dir has no `main.tf` errors ("No IaC directory") or silently does nothing. This guards
// that every registered stack actually exists — the exact bug where `account` was in the
// registry but its dir held only a README.
test("every INFRA stack points at a real dir with a main.tf", () => {
  for (const row of INFRA) {
    const dir = resolve(REPO_ROOT, row.dir);
    assert.ok(existsSync(dir), `${row.name}: dir missing — ${row.dir}`);
    assert.ok(
      existsSync(resolve(dir, "main.tf")),
      `${row.name}: no main.tf in ${row.dir}`,
    );
  }
});

// Names + apply orders must be unique — the runner dispatches by name, and `ordered()` relies
// on distinct orders for a deterministic apply sequence.
test("INFRA rows have unique names + unique apply orders", () => {
  const names = INFRA.map((r) => r.name);
  assert.equal(new Set(names).size, names.length, "duplicate stack name");
  const orders = INFRA.map((r) => r.order);
  assert.equal(new Set(orders).size, orders.length, "duplicate apply order");
});
