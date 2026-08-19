import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import {
  DATABASES,
  KINDS,
  ALTITUDES,
  ordered,
  byKind,
  byAltitude,
} from "./databases.mjs";
import {
  INFRA,
  PROVIDERS,
  ordered as infraOrdered,
} from "./infra-registry.mjs";

const KINDSET = new Set(KINDS);
const ALTSET = new Set(ALTITUDES);
const PROVSET = new Set(PROVIDERS);

test("every db row is well-formed with a known kind + altitude", () => {
  for (const d of DATABASES) {
    assert.ok(
      d.name && d.owner && d.dir && d.backup && typeof d.order === "number",
      `bad db row: ${d.name}`,
    );
    assert.ok(KINDSET.has(d.kind), `unknown kind for ${d.name}: ${d.kind}`);
    assert.ok(
      ALTSET.has(d.altitude),
      `unknown altitude for ${d.name}: ${d.altitude}`,
    );
  }
});

test("db names are unique", () => {
  const names = DATABASES.map((d) => d.name);
  assert.equal(new Set(names).size, names.length);
});

test("every db row's `dir` exists (no drift / no orphans)", () => {
  for (const d of DATABASES)
    assert.ok(
      existsSync(d.dir),
      `db ${d.name} lists ${d.dir} but it is missing`,
    );
});

test("ordered() sorts by order then name; helpers filter", () => {
  const o = ordered();
  for (let i = 1; i < o.length; i++)
    assert.ok(o[i - 1].order <= o[i].order, "not order-sorted");
  assert.equal(
    byKind("d1").length,
    DATABASES.filter((d) => d.kind === "d1").length,
  );
  assert.equal(
    byAltitude("global").length,
    DATABASES.filter((d) => d.altitude === "global").length,
  );
});

test("every infra row is well-formed + its dir exists", () => {
  for (const i of INFRA) {
    assert.ok(
      i.name && i.owner && i.dir && typeof i.order === "number",
      `bad infra row: ${i.name}`,
    );
    assert.ok(
      PROVSET.has(i.provider),
      `unknown provider for ${i.name}: ${i.provider}`,
    );
    assert.ok(
      ALTSET.has(i.altitude),
      `unknown altitude for ${i.name}: ${i.altitude}`,
    );
    assert.ok(
      existsSync(i.dir),
      `infra ${i.name} lists ${i.dir} but it is missing`,
    );
  }
});

test("infra ordered() is order-sorted", () => {
  const o = infraOrdered();
  for (let i = 1; i < o.length; i++)
    assert.ok(o[i - 1].order <= o[i].order, "not order-sorted");
});
