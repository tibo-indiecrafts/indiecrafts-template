import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { declaredKeys } from "../data/secrets.mjs";

// A Worker secret reaches a deployed env only through `secrets.mjs`, which syncs the keys a
// service's `.dev.vars.example` declares — in CI, from the deploy job's `env:` list. A secret the
// code reads but never declares silently stays unset (the api's export + self-erasure answered
// 503 for want of CLERK_SECRET_KEY / SANITY_API_WRITE_TOKEN). Bindings + wrangler [vars] are
// config, not secrets.
const REPO = fileURLToPath(new URL("../../../..", import.meta.url));
const SERVICES = ["api", "cron", "workers"].map((s) =>
  join(REPO, "code/shared", s),
);
const NOT_SECRETS = /^(TEST_|BUILD_)/;
// Public [vars] documented in wrangler.toml's comment list (not secrets, never synced as one).
const DOCUMENTED_VARS = new Set(["WEBSITE_URL"]);

const srcFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? srcFiles(join(dir, e.name))
      : e.name.endsWith(".ts") && !e.name.endsWith(".test.ts")
        ? [join(dir, e.name)]
        : [],
  );
const configNames = (toml) =>
  new Set([
    ...[
      ...toml.matchAll(/^\s*#?\s*(?:binding|name)\s*=\s*"([A-Z0-9_]+)"/gm),
    ].map((m) => m[1]),
    ...[...toml.matchAll(/^\s*#?\s*([A-Z][A-Z0-9_]+)\s*=/gm)].map((m) => m[1]),
  ]);

for (const dir of SERVICES) {
  test(`${dir.split("/").pop()}: every secret the code reads is declared in .dev.vars.example`, () => {
    const used = new Set(
      srcFiles(join(dir, "src")).flatMap((f) =>
        [...readFileSync(f, "utf8").matchAll(/\benv\.([A-Z][A-Z0-9_]+)/g)].map(
          (m) => m[1],
        ),
      ),
    );
    const config = configNames(
      readFileSync(join(dir, "wrangler.toml"), "utf8"),
    );
    const example = join(dir, ".dev.vars.example");
    const declared = existsSync(example)
      ? declaredKeys(readFileSync(example, "utf8"))
      : new Set();
    const missing = [...used]
      .filter(
        (k) =>
          !config.has(k) &&
          !declared.has(k) &&
          !DOCUMENTED_VARS.has(k) &&
          !NOT_SECRETS.test(k),
      )
      .sort();
    assert.deepEqual(missing, []);
  });
}

test("the CI deploy passes every declared Worker secret (deploy-app.yml env)", () => {
  const workflow = readFileSync(
    join(REPO, ".github/workflows/deploy-app.yml"),
    "utf8",
  );
  const missing = SERVICES.flatMap((dir) => {
    const example = join(dir, ".dev.vars.example");
    return existsSync(example)
      ? [...declaredKeys(readFileSync(example, "utf8"))]
      : [];
  }).filter(
    (k) =>
      !new RegExp(
        `^\\s+${k}:\\s*\\$\\{\\{\\s*secrets\\.${k}\\s*\\}\\}`,
        "m",
      ).test(workflow),
  );
  assert.deepEqual([...new Set(missing)].sort(), []);
});
