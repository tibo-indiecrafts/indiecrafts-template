// The instance resource manifest — every Cloudflare resource ONE deployed instance owns,
// per env, DERIVED from the registries + the prefix. "Anonymised": no account-specific ids,
// so it works for any client rename. Single source of truth for what a deploy creates —
// read by the teardown script (`scripts/infra/teardown.mjs`, which removes them all before
// shipping the template) and the authoritative list for the deploy docs.
//
// Name conventions (all `<prefix>-<env>-…`, from `resourceName`):
//   Workers  — every Cloudflare app: api·cron·workers·agent (worker-cf) +
//              website·admin·app (next-cf / OpenNext) + storybook (static-assets worker).
//   D1       — the api's two EU D1s: `<prefix>-<env>-db-audit` (audit) + `-db-main` (main).
//   KV       — `<api>-security-counters` (short-TTL failed-login counters).
//   R2       — `<prefix>-<env>-db-backup` (D1 snapshots) · `<api>-export` (GDPR export bundles) ·
//              `<web-app>-isr` per next-cf app (OpenNext incremental cache) ·
//              `<hybrid>-releases` (desktop installers).
//
// NOTE: a fresh instance may not have created every resource yet (R2 export/backup and the
// ISR buckets are provisioned on demand) — teardown treats a missing resource as already-gone.

import { fileURLToPath } from "node:url";
import { deployable, resourceName } from "./apps.mjs";
import { readSitePrefix } from "./project.mjs";

/** Every Cloudflare resource an instance owns in one env, by kind. */
export function instanceResources(env, prefix) {
  const workers = deployable().map((a) => resourceName(a.slug, env, prefix)); // CF apps, in order
  const api = resourceName("api", env, prefix);
  const webApps = ["website", "admin", "app"];
  return {
    workers, // includes the next-cf apps + storybook (all deploy as Workers)
    d1: [`${prefix}-${env}-db-audit`, `${prefix}-${env}-db-main`],
    kv: [`${api}-security-counters`],
    r2: [
      `${prefix}-${env}-db-backup`,
      `${api}-export`,
      ...webApps.map((s) => `${resourceName(s, env, prefix)}-isr`),
      `${resourceName("hybrid", env, prefix)}-releases`,
    ],
  };
}

// ── CLI: print the resource list for an env (inspection / teardown --dry-run) ──
// Prefix defaults to THIS instance's (config, env-overridable) — same source as deploy.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const env = process.argv[2] || "dev";
  const prefix = process.argv[3] || readSitePrefix();
  const r = instanceResources(env, prefix);
  for (const [kind, names] of Object.entries(r))
    for (const n of names) console.log(`${kind}\t${n}`);
}
