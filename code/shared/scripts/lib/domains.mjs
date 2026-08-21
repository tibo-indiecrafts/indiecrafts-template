// The domain registry — the single source of truth for "which app serves which
// hostname in which env." Mirrors `apps.mjs` / `databases.mjs`. Everything that
// needs a host derives it from HERE (never re-declares it):
//   • the Next build's `NEXT_PUBLIC_SITE_URL` (deploy exports it — see deploy/next.mjs)
//   • the Cloudflare Worker route  (`[[env.<env>.routes]]` in wrangler.toml)
//   • the Terraform edge  (`domain` / `zone_id` / `turnstile_domains` tfvars)
// Emit those with `deploy/domains.mjs print <app> <env>` (prints the blocks to paste,
// like `infra/bindings.mjs` — static TOML is edited by hand, not magically).
//
// One row per app; per-env host (null = no custom domain → the `*.workers.dev` URL).
// `zone` + `aliases` (e.g. www) live with the host. Turnstile hosts = host + aliases.
//
// NOTE: hostname (this file) is a SEPARATE axis from the resource-name prefix
// (`DEFAULT_SITE_PREFIX` / `project:rename`) — don't conflate them.
//
// CLI: node code/shared/scripts/lib/domains.mjs --json [--app <a>] [--env <e>]

import { fileURLToPath } from "node:url";
import { ENVS } from "./apps.mjs";

export { ENVS };

/**
 * @typedef {Object} EnvDomain
 * @property {string} host      the primary hostname (e.g. `example.com`)
 * @property {string[]} [aliases]  extra hostnames that also route here (e.g. `www.example.com`)
 * @property {string} [zone]    the Cloudflare zone (usually the apex of `host`)
 */
/**
 * @typedef {Object} DomainEntry
 * @property {string} app                 the app slug (matches an `apps.mjs` row)
 * @property {Partial<Record<"dev"|"staging"|"prod", EnvDomain|null>>} envs
 *   per-env custom domain; `null` (or absent) = no custom domain (serves `*.workers.dev`)
 */

/** @type {DomainEntry[]} */
export const DOMAINS = [
  {
    app: "website",
    envs: {
      // dev + staging publish to *.workers.dev by default (no custom domain).
      dev: null,
      staging: null,
      // prod: the live host. Fill `host` + `zone` per client (placeholder today).
      prod: {
        host: "example.com",
        aliases: ["www.example.com"],
        zone: "example.com",
      },
    },
  },
  // admin + app as SUBDOMAINS of the website root — so Clerk drops the session cookie
  // on the parent domain and all three share the session (one login across surfaces),
  // free, no satellite config. Placeholders (`example.com`) → served on `*.workers.dev`
  // until the operator sets the real root here + in the website row above.
  {
    app: "admin",
    envs: {
      dev: null,
      staging: null,
      prod: { host: "admin.example.com", zone: "example.com" },
    },
  },
  {
    app: "app",
    envs: {
      dev: null,
      staging: null,
      prod: { host: "app.example.com", zone: "example.com" },
    },
  },
  // The shared api Worker on its own host — so surfaces call `https://api.<root>`
  // (their `API_URL`) instead of a long, sometimes-blocked `*.workers.dev` URL.
  // Placeholder → workers.dev until the operator sets the real host + a `route` in
  // `code/shared/api/wrangler.toml`.
  {
    app: "api",
    envs: {
      dev: null,
      staging: null,
      prod: { host: "api.example.com", zone: "example.com" },
    },
  },
  // Add a row per app that gets a custom domain (another subdomain, …). Apps with no
  // row serve only `*.workers.dev`.
];

const PLACEHOLDER_HOSTS = new Set(["example.com", "your-domain.com", ""]);

/** The custom domain config for an app+env, or null when there is none. */
export function domainFor(app, env) {
  return DOMAINS.find((d) => d.app === app)?.envs?.[env] ?? null;
}

/** True once the host is a real one (not the template placeholder). */
export const isConfigured = (d) =>
  Boolean(d?.host && !PLACEHOLDER_HOSTS.has(d.host));

/** The runtime origin (`https://<host>`) for an app+env, or "" if none / placeholder. */
export function originFor(app, env) {
  const d = domainFor(app, env);
  return isConfigured(d) ? `https://${d.host}` : "";
}

/** Every hostname (primary + aliases) for an app+env — for Turnstile / routes. */
export function hostsFor(app, env) {
  const d = domainFor(app, env);
  return d?.host ? [d.host, ...(d.aliases ?? [])] : [];
}

export const byApp = (app) => DOMAINS.filter((d) => d.app === app);

// ── CLI ───────────────────────────────────────────────────────────────────────
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const ai = argv.indexOf("--app");
  let rows = ai >= 0 ? byApp(argv[ai + 1]) : DOMAINS;
  if (argv.includes("--json")) {
    process.stdout.write(JSON.stringify(rows));
  } else {
    for (const d of rows)
      for (const env of ENVS)
        console.log(
          `${d.app}\t${env}\t${d.envs?.[env]?.host ?? "(workers.dev)"}`,
        );
  }
}
