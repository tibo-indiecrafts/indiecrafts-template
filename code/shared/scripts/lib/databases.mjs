// The database registry — the single source of truth for "which databases exist,
// at what altitude, of what kind, owned by whom, in what apply order." Mirrors
// `scripts/lib/apps.mjs`. The migrate + backup runners read THIS and dispatch on
// `kind` (like deploy dispatches on an app's `class`). `db:migrate:<name>:<env>` also
// takes a pre-migration R2 snapshot before each REMOTE schema change (retention + layout →
// docs/apps/web/setup/backups.md).
//
// Adding a database = one row here + fill its slot (real migrations, or a README marker
// under `<slot>/db/<kind>/`). Active today: the api's `core` + `audit` D1s + `security-counters` KV.
// Every OTHER altitude × kind slot is a reserved README marker (see the examples below).
//
// Kinds (engine → migrate/backup recipe):
//   d1        — Cloudflare D1 (SQLite, a Worker binding). migrate: wrangler · backup: wrangler d1 export
//   kv        — Cloudflare KV (key-value cache/ephemeral).                backup: bulk key dump
//   postgres  — Postgres (Drizzle/psql).                 migrate: drizzle-kit · backup: pg_dump
//   supabase  — hosted Postgres (Supabase CLI).          migrate: supabase · backup: supabase db dump
//   sanity    — content store (per-client dataset).                       backup: sanity dataset export
//               (global/content only — one dataset per client, one hub Studio)
//
// Altitudes (who shares it — mirrors the projects tree):
//   global    — code/shared/db          (every project; a shared-tier item)
//   platform  — code/projects/<platform>/shared/db
//   leaf      — code/projects/<platform>/surfaces/<leaf>/db   (co-located with its one app)
//   (a single-owner DB may instead co-locate in its owner, e.g. shared/api/db — the `dir` decides.)
//
// CLI (for CI / inspection): node scripts/lib/databases.mjs --json [--kind <k>] [--altitude <a>]

import { fileURLToPath } from "node:url";
import { ENVS } from "./apps.mjs";

export { ENVS };

export const KINDS = ["d1", "kv", "postgres", "supabase", "sanity"];
export const ALTITUDES = ["global", "platform", "surface", "leaf"];

/**
 * @typedef {Object} DbEntry
 * @property {string} name   short id + `db:backup:<name>:<env>` / `db:migrate:<name>:<env>` script name
 * @property {"d1"|"kv"|"postgres"|"supabase"|"sanity"} kind  engine → migrate/backup recipe
 * @property {string} owner  the app/service slug that binds + migrates it (ONE owner; consumers use its API)
 * @property {string} [binding]  the wrangler binding name (e.g. "DB") — d1/kv only; the migrate
 *                               runner passes it to wrangler so it resolves the right per-env database
 * @property {"global"|"platform"|"surface"|"leaf"} altitude  who shares it
 * @property {string} dir    the db's directory (migrations/seed) — reserved until activated
 * @property {"wrangler"|"pg_dump"|"supabase"|"kv"|"sanity"} backup  backup recipe
 * @property {number} order  apply order (low first: a DB before its consumers)
 */

/** @type {DbEntry[]} */
export const DATABASES = [
  // The one real database — the tenant's Sanity content dataset (one per client,
  // one hub Studio). No migrations (schema is code); backup = dataset export.
  {
    name: "content",
    kind: "sanity",
    owner: "website",
    altitude: "global",
    dir: "code/shared/db/sanity/content",
    backup: "sanity",
    order: 5,
  },
  // Two EU D1s, both owned by `api`, both `--location weur` (create-time + immutable):
  //   core  (binding CORE_DB) — identity/rights/settings: user_profiles, consent_events,
  //         data_requests, erasure_requests, export_requests, site_settings.
  //   audit (binding DB) — append-only telemetry firehose: session_events, security_events,
  //         admin_audit, csp_reports, backup_runs; retention-purged by the `cron` worker.
  // Split so a firehose migration/write-spike can't threaten identity data (spec 2026-08-25).
  {
    name: "core",
    kind: "d1",
    owner: "api",
    binding: "CORE_DB",
    altitude: "global",
    dir: "code/shared/api/db/core",
    backup: "wrangler",
    order: 8,
  },
  {
    name: "audit",
    kind: "d1",
    owner: "api",
    binding: "DB",
    altitude: "global",
    dir: "code/shared/api/db/audit",
    backup: "wrangler",
    order: 10,
  },
  // Ephemeral KV for the app-level detection layer — short-TTL failed-login counters
  // (binding `SECURITY_COUNTERS`). KV has no schema migrations, and the data is disposable
  // rate-state, so it is intentionally NOT backed up (`backup: "kv"` is a no-op here). Listed
  // so the registry stays the full source of truth for which stores exist.
  {
    name: "security-counters",
    kind: "kv",
    owner: "api",
    binding: "SECURITY_COUNTERS",
    altitude: "global",
    dir: "code/shared/api/db/kv/security-counters",
    backup: "kv",
    order: 15,
  },
  // Every other altitude × kind slot is a reserved README marker. Activate by adding
  // a row here + filling the matching `<slot>/db/<kind>/<name>/` folder:
  //
  // { name: "sessions", kind: "kv", owner: "api", altitude: "global",
  //   dir: "code/shared/db/kv/sessions", backup: "kv", order: 10 },
  // { name: "web-analytics", kind: "postgres", owner: "website", altitude: "leaf",
  //   dir: "code/projects/web/surfaces/website/db/postgres/analytics", backup: "pg_dump", order: 20 },
];

/** The kinds that live on Cloudflare (reached via wrangler). */
export const CLOUDFLARE_KINDS = new Set(["d1", "kv"]);
export const isCloudflareDb = (db) => CLOUDFLARE_KINDS.has(db.kind);

export const byKind = (kind) => DATABASES.filter((d) => d.kind === kind);
export const byAltitude = (alt) => DATABASES.filter((d) => d.altitude === alt);

/** Databases in apply order (low `order` first, then by name). */
export function ordered() {
  return [...DATABASES].sort(
    (a, b) => a.order - b.order || a.name.localeCompare(b.name),
  );
}

// ── CLI: emit the db list (CI / inspection) ───────────────────────────────────
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  let list = ordered();
  const ki = argv.indexOf("--kind");
  const ai = argv.indexOf("--altitude");
  if (ki >= 0) list = list.filter((d) => d.kind === argv[ki + 1]);
  if (ai >= 0) list = list.filter((d) => d.altitude === argv[ai + 1]);
  if (argv.includes("--json")) {
    process.stdout.write(JSON.stringify(list));
  } else {
    for (const d of list)
      console.log(`${d.name}\t${d.kind}\t${d.owner}\t${d.altitude}\t${d.dir}`);
  }
}
