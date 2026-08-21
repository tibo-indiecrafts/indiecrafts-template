import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { APPS, ENVS, deployable, isCloudflare, resourceName } from "./apps.mjs";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");

const CLASSES = new Set(["next-cf", "worker-cf", "expo", "electron"]);

test("every app row is well-formed with a known platform class", () => {
  for (const a of APPS) {
    assert.ok(
      a.slug && a.pkg && a.class && typeof a.order === "number",
      `bad row: ${a.slug}`,
    );
    assert.ok(CLASSES.has(a.class), `unknown class for ${a.slug}: ${a.class}`);
  }
});

test("slugs are unique", () => {
  const slugs = APPS.map((a) => a.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test("each app row's `dir` exists (no drift / no orphans)", () => {
  for (const a of APPS) {
    assert.ok(
      a.dir && a.platform && a.kind,
      `row ${a.slug} missing dir/platform/kind`,
    );
    assert.ok(
      existsSync(a.dir),
      `registry lists ${a.slug} but ${a.dir} is missing`,
    );
  }
});

test("deployable() defaults to Cloudflare apps, in deploy order", () => {
  const cf = deployable();
  assert.ok(cf.every(isCloudflare), "default set must be Cloudflare-only");
  assert.deepEqual(
    cf.map((a) => a.slug),
    ["agent", "api", "cron", "workers", "website", "admin", "app"],
  );
});

test("deployable({ only: 'all' }) includes the native classes", () => {
  const all = deployable({ only: "all" });
  assert.ok(
    all.some((a) => a.class === "expo"),
    "expo missing",
  );
  assert.ok(
    all.some((a) => a.class === "electron"),
    "electron missing",
  );
});

test("ENVS are the three Cloudflare deploy envs", () => {
  assert.deepEqual(ENVS, ["dev", "staging", "prod"]);
});

test("resourceName = <prefix>-<env>-<folder-tail> (env-first, tree-derived)", () => {
  // Tail = dir under code/, minus a leading projects/, dash-joined. Surfaces
  // carry their platform + `surfaces`; shared services stay flat (`shared`).
  assert.equal(
    resourceName("website", "prod", "indiecrafts"),
    "indiecrafts-prod-web-surfaces-website",
  );
  assert.equal(
    resourceName("website", "dev", "indiecrafts"),
    "indiecrafts-dev-web-surfaces-website",
  );
  assert.equal(
    resourceName("admin", "staging", "indiecrafts"),
    "indiecrafts-staging-web-surfaces-admin",
  );
  assert.equal(
    resourceName("api", "prod", "indiecrafts"),
    "indiecrafts-prod-shared-api",
  );
  assert.equal(
    resourceName("workers", "dev", "acme"), // a client prefix only swaps the head
    "acme-dev-shared-workers",
  );
});

test("resourceName rejects an unknown slug, bad env, or missing prefix", () => {
  assert.throws(() => resourceName("nope", "dev", "indiecrafts"));
  assert.throws(() => resourceName("api", "preprod", "indiecrafts"));
  assert.throws(() => resourceName("api", "dev", ""));
});

test("every Cloudflare app resolves a name for each env (no throw)", () => {
  for (const a of deployable()) {
    const tail = a.dir
      .replace(/^code\//, "")
      .replace(/^projects\//, "")
      .replaceAll("/", "-");
    for (const env of ENVS) {
      assert.equal(
        resourceName(a.slug, env, "indiecrafts"),
        `indiecrafts-${env}-${tail}`,
      );
    }
  }
});

// The invariant the clobber-guard depends on: every SHIPPED wrangler `[env.*]`
// name equals `resourceName(slug, env, TEMPLATE_PREFIX)`. If a toml name drifts
// from the formula, or the formula drifts from the tomls, the guard would compare
// against the wrong string and silently stop protecting a shared-account prod
// deploy — this fails first.
test("shipped wrangler names match resourceName (keeps the clobber-guard live)", () => {
  const nameFor = (toml, env) => {
    const m = toml.match(
      new RegExp(`\\[env\\.${env}\\][\\s\\S]*?\\n\\s*name\\s*=\\s*"([^"]+)"`),
    );
    return m ? m[1] : null;
  };
  for (const a of deployable()) {
    const toml = resolve(REPO_ROOT, a.dir, "wrangler.toml");
    assert.ok(existsSync(toml), `${a.slug}: wrangler.toml missing at ${a.dir}`);
    const src = readFileSync(toml, "utf8");
    for (const env of ENVS) {
      assert.equal(
        nameFor(src, env),
        resourceName(a.slug, env, "indiecrafts"),
        `${a.slug} [env.${env}] name must follow <prefix>-<env>-<platform>-<slug>`,
      );
    }
  }
});
