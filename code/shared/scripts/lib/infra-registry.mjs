// The infra registry — the single source of truth for "which IaC stacks exist,
// at what altitude, for which provider, owned by whom, in what apply order."
// Mirrors `scripts/lib/apps.mjs` + `databases.mjs`. The infra runner reads THIS
// and dispatches on `provider`.
//
// This is the DECLARATIVE registry; the RUNNER is `scripts/infra.mjs` (terraform
// per app × env). Today infra is co-located per-app (`<app>/infra/`) and resolved
// from `apps.mjs`; this registry generalises it to any altitude + provider.
//
// Providers (→ IaC recipe):
//   cloudflare — Terraform on the Cloudflare provider (DNS · WAF · cache · Turnstile). REAL today.
//   aws        — Terraform on AWS.       reserved
//   vercel     — Terraform on Vercel.    reserved
//
// Altitudes (mirrors the projects tree):
//   global    — code/shared/infra          (account-level: DNS zone, account settings)
//   platform  — code/projects/<platform>/shared/infra
//   leaf      — code/projects/<platform>/surfaces/<leaf>/infra   (e.g. website/infra/cloudflare — REAL)
//
// CLI: node scripts/lib/infra-registry.mjs --json [--provider <p>] [--altitude <a>]

import { fileURLToPath } from "node:url";
import { ENVS } from "./apps.mjs";

export { ENVS };

export const PROVIDERS = ["cloudflare", "aws", "vercel"];
export const ALTITUDES = ["global", "platform", "surface", "leaf"];

/**
 * @typedef {Object} InfraEntry
 * @property {string} name   short id + `infra:<name>:<action>:<env>` script name
 * @property {"cloudflare"|"aws"|"vercel"} provider  IaC provider → recipe
 * @property {string} owner  the app/service/tier slug this stack belongs to
 * @property {"global"|"platform"|"surface"|"leaf"} altitude  scope
 * @property {string} dir    the stack's directory (main.tf + env/<env>.tfvars) — reserved until activated
 * @property {number} order  apply order (low first)
 */

/** @type {InfraEntry[]} */
export const INFRA = [
  // The one REAL stack today — the website's Cloudflare edge, folded under its
  // provider subfolder. (Its runner path is still resolved by `scripts/infra.mjs`
  // via `apps.mjs`; this row documents it in the generalised model.)
  {
    name: "website",
    provider: "cloudflare",
    owner: "website",
    altitude: "leaf",
    dir: "code/projects/web/surfaces/website/infra/cloudflare",
    order: 30,
  },
  // The shared api Worker's Cloudflare edge — a trimmed sibling of the website's stack
  // (custom domain + rate-limit + WAF + bot + leaked-creds + zone hardening; no Turnstile).
  // INERT until the api has a real zone (dev/staging on *.workers.dev); the inline guard in
  // src/index.ts protects the Worker regardless. See code/shared/api/infra/cloudflare/main.tf.
  {
    name: "api",
    provider: "cloudflare",
    owner: "api",
    altitude: "global",
    dir: "code/shared/api/infra/cloudflare",
    order: 20,
  },
  // Account-altitude stack — account-wide Cloudflare config (zone creation, account
  // settings) that isn't tied to one zone/app. Applied first (lowest order).
  {
    name: "account",
    provider: "cloudflare",
    owner: "shared",
    altitude: "global",
    dir: "code/shared/infra/cloudflare/account",
    order: 10,
  },
  // The `app` surface's edge — a next-cf sibling of the website stack.
  {
    name: "app",
    provider: "cloudflare",
    owner: "app",
    altitude: "leaf",
    dir: "code/projects/web/surfaces/app/infra/cloudflare",
    order: 31,
  },
  // The `admin` surface's edge — the website stack PLUS a Cloudflare Zero Trust Access
  // gate (admin is SSO-gated: only the allowed email domain reaches the Worker).
  {
    name: "admin",
    provider: "cloudflare",
    owner: "admin",
    altitude: "leaf",
    dir: "code/projects/web/surfaces/admin/infra/cloudflare",
    order: 32,
  },
  // The `storybook` static-assets Worker's edge — minimal (custom domain + zone hardening).
  {
    name: "storybook",
    provider: "cloudflare",
    owner: "storybook",
    altitude: "leaf",
    dir: "code/projects/web/tools/storybook/infra/cloudflare",
    order: 33,
  },
];

export const byProvider = (provider) =>
  INFRA.filter((i) => i.provider === provider);
export const byAltitude = (alt) => INFRA.filter((i) => i.altitude === alt);

/** Infra stacks in apply order. */
export function ordered() {
  return [...INFRA].sort(
    (a, b) => a.order - b.order || a.name.localeCompare(b.name),
  );
}

// ── CLI ───────────────────────────────────────────────────────────────────────
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  let list = ordered();
  const pi = argv.indexOf("--provider");
  const ai = argv.indexOf("--altitude");
  if (pi >= 0) list = list.filter((i) => i.provider === argv[pi + 1]);
  if (ai >= 0) list = list.filter((i) => i.altitude === argv[ai + 1]);
  if (argv.includes("--json")) {
    process.stdout.write(JSON.stringify(list));
  } else {
    for (const i of list)
      console.log(
        `${i.name}\t${i.provider}\t${i.owner}\t${i.altitude}\t${i.dir}`,
      );
  }
}
