import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { INFRA } from "./infra-registry.mjs";

const REPO_ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../../..",
);

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

// The surfaces share one root zone (admin/app/api are subdomains of the website's), and bot
// management is a zone setting: every stack that declares it must pin the same AI-crawler
// values, or the last `terraform apply` silently flips the zone (a training block also stops
// Googlebot/Bingbot, and a managed robots.txt overrides the site's own).
test("every bot_management block pins the same AI-crawler settings (robots.txt owns the opt-out)", () => {
  const blocks = INFRA.map((row) => [
    row.name,
    resolve(REPO_ROOT, row.dir, "main.tf"),
  ])
    .filter(([, f]) => existsSync(f))
    .map(([name, f]) => [
      name,
      readFileSync(f, "utf8").match(
        /resource "cloudflare_bot_management"[\s\S]*?\n}/,
      )?.[0],
    ])
    .filter(([, block]) => block);
  assert.ok(blocks.length > 0, "no cloudflare_bot_management found");
  for (const [name, block] of blocks) {
    assert.match(
      block,
      /ai_bots_protection\s*=\s*"disabled"/,
      `${name}: ai_bots_protection`,
    );
    assert.match(
      block,
      /crawler_protection\s*=\s*"disabled"/,
      `${name}: crawler_protection`,
    );
    assert.match(
      block,
      /is_robots_txt_managed\s*=\s*false/,
      `${name}: is_robots_txt_managed`,
    );
  }
});

// Zone-wide singletons: a zone holds ONE entrypoint ruleset per phase, one bot-management
// config, one tiered-cache setting and one value per zone setting. Every stack gates them
// behind `local.manage_zone`, so the stacks that share a zone don't collide.
const ZONE_SINGLETONS =
  /^resource "(cloudflare_ruleset|cloudflare_bot_management|cloudflare_tiered_cache|cloudflare_zone_setting)" "([a-z_]+)" \{([\s\S]*?)\n\}/gm;
test("every zone-wide singleton is gated by local.manage_zone", () => {
  for (const row of INFRA) {
    const f = resolve(REPO_ROOT, row.dir, "main.tf");
    for (const [, type, name, body] of readFileSync(f, "utf8").matchAll(
      ZONE_SINGLETONS,
    ))
      assert.match(
        body,
        /^\s*count\s*=.*local\.manage_zone/m,
        `${row.name}: ${type}.${name} is not gated`,
      );
  }
});

// Only one stack × env may own a zone: the second apply would try to create the same
// entrypoint rulesets and fail. The zone is the domain's last two labels (the template's
// placeholders); `manage_zone` defaults to true.
test("at most one stack × env owns each zone (manage_zone)", () => {
  const owners = new Map();
  for (const row of INFRA) {
    for (const env of ["dev", "staging", "prod"]) {
      const f = resolve(REPO_ROOT, row.dir, "env", `${env}.tfvars`);
      if (!existsSync(f)) continue;
      const vars = readFileSync(f, "utf8");
      const val = (k) =>
        vars.match(new RegExp(`^${k}\\s*=\\s*("?)([^"\\s#]*)\\1`, "m"))?.[2];
      if (val("attach_domain") !== "true" || val("manage_zone") === "false")
        continue;
      const zone = (val("domain") ?? "").split(".").slice(-2).join(".");
      owners.set(zone, [...(owners.get(zone) ?? []), `${row.name}/${env}`]);
    }
  }
  for (const [zone, list] of owners)
    assert.equal(list.length, 1, `${zone} owned by ${list.join(", ")}`);
});
