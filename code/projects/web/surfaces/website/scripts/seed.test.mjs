import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SEED = fileURLToPath(new URL("./seed.mjs", import.meta.url));

/** The documents a profile writes — `--dry-run` prints them; no network, no env. */
function docs(...flags) {
  const r = spawnSync(process.execPath, [SEED, "--dry-run", ...flags], {
    encoding: "utf8",
  });
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout);
}

const baseline = docs();
const demo = docs("--demo");

const DEMO_TYPES = [
  "post",
  "author",
  "category",
  "tag",
  "series",
  "quote",
  "person",
  "comment",
  "waitlistEntry",
  "announcementBar",
  "announcementToast",
];
const PRIVATE_TYPES = ["comment", "contactMessage", "waitlistEntry", "emailStrings"];

/** Every `_ref` in a value, except image/file assets (uploaded, not seeded). */
function refs(value, out = []) {
  if (Array.isArray(value)) value.forEach((v) => refs(v, out));
  else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (k === "_ref" && !/^(image|file)-/.test(v)) out.push(v);
      else refs(v, out);
    }
  }
  return out;
}

test("the baseline holds what a site needs and no demo content", () => {
  const types = new Set(baseline.map((d) => d._type));
  for (const t of [
    "siteSettings",
    "siteMeta",
    "uiMessages",
    "legalPage",
    "navigation",
    "cookieConsent",
    "legalConsent",
    "blog",
    "emailStrings",
  ])
    assert.ok(types.has(t), `baseline misses ${t}`);
  for (const t of DEMO_TYPES) assert.ok(!types.has(t), `baseline holds demo ${t}`);
});

test("--demo adds the demo content on top of the baseline", () => {
  const ids = new Set(demo.map((d) => d._id));
  for (const d of baseline) assert.ok(ids.has(d._id), `demo misses baseline ${d._id}`);
  const types = new Set(demo.map((d) => d._type));
  for (const t of DEMO_TYPES) assert.ok(types.has(t), `demo misses ${t}`);
});

for (const [name, set] of [
  ["baseline", baseline],
  ["demo", demo],
]) {
  test(`${name}: every reference points at a document in the same seed`, () => {
    const ids = new Set(set.map((d) => d._id));
    const missing = set.flatMap((d) =>
      refs(d)
        .filter((r) => !ids.has(r))
        .map((r) => `${d._id} → ${r}`),
    );
    assert.deepEqual(missing, []); // a missing strong reference fails the whole transaction
  });

  test(`${name}: ids are unique, and personal or operator data has a private id`, () => {
    assert.equal(new Set(set.map((d) => d._id)).size, set.length);
    const open = set.filter(
      (d) => PRIVATE_TYPES.includes(d._type) && !d._id.startsWith("private."),
    );
    assert.deepEqual(
      open.map((d) => d._id),
      [],
    );
  });
}
