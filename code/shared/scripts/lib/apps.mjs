// The app registry — the single source of truth for "which apps exist, what
// platform each targets, and in what order they deploy." Every deploy runner,
// the deploy-all orchestrator, project-rename, and CI read this instead of
// re-deriving it (previously: scan `code/projects/*/wrangler.toml`, which can't
// see non-Cloudflare apps like mobile/desktop).
//
// Adding an app = one row here + its own `deploy:<slug>:<env>` script. That's it.
//
// Platform classes:
//   next-cf   — Next.js → OpenNext → Cloudflare Workers (website · admin)
//   worker-cf — a bare Cloudflare Worker (api · cron · workers)
//   expo      — React Native / Expo, ships via EAS (mobile) — NOT Cloudflare
//   electron  — desktop, ships via electron-builder (hybrid) — NOT Cloudflare
//
// CLI (for the CI matrix): `node scripts/lib/apps.mjs --json [--cloudflare]`

import { fileURLToPath } from "node:url";

/** The deploy environments every Cloudflare app supports. Native classes map these to their own concept (EAS profile / build channel). */
export const ENVS = ["dev", "staging", "prod"];

/**
 * @typedef {Object} AppEntry
 * @property {string} slug   short id + `deploy:<slug>:<env>` script name
 * @property {string} pkg    the workspace package name (`pnpm --filter` target)
 * @property {"next-cf"|"worker-cf"|"expo"|"electron"} class  platform class → deploy recipe
 * @property {"web"|"mobile"|"hybrid"|"shared"} platform  which platform folder it lives under
 * @property {"surface"|"service"} kind  surface (a user-facing site/screen/app) vs service (a worker backend)
 * @property {string} dir    the project's directory — `code/projects/<platform>/<kind>s/<leaf>`.
 *   The leaf can differ from `slug` (e.g. slug `mobile` lives at `mobile/surfaces/main`), so every
 *   path resolver reads THIS, never `code/projects/<slug>` (dirs nest by platform → kind).
 * @property {number} order  deploy order (low first: services before their consumers)
 */

/** @type {AppEntry[]} */
export const APPS = [
  {
    slug: "api",
    pkg: "@indiecrafts/api",
    class: "worker-cf",
    platform: "shared",
    kind: "service",
    dir: "code/shared/api",
    order: 10,
  },
  {
    slug: "cron",
    pkg: "@indiecrafts/cron",
    class: "worker-cf",
    platform: "shared",
    kind: "service",
    dir: "code/shared/cron",
    order: 10,
  },
  {
    slug: "workers",
    pkg: "@indiecrafts/workers",
    class: "worker-cf",
    platform: "shared",
    kind: "service",
    dir: "code/shared/workers",
    order: 10,
  },
  {
    slug: "website",
    pkg: "@indiecrafts/website",
    class: "next-cf",
    platform: "web",
    kind: "surface",
    dir: "code/projects/web/surfaces/website",
    order: 30,
  },
  {
    slug: "admin",
    pkg: "@indiecrafts/admin",
    class: "next-cf",
    platform: "web",
    kind: "surface",
    dir: "code/projects/web/surfaces/admin",
    order: 40,
  },
  {
    slug: "mobile",
    pkg: "@indiecrafts/mobile",
    class: "expo",
    platform: "mobile",
    kind: "surface",
    dir: "code/projects/mobile/surfaces/main",
    order: 50,
  },
  {
    slug: "hybrid",
    pkg: "@indiecrafts/hybrid",
    class: "electron",
    platform: "hybrid",
    kind: "surface",
    dir: "code/projects/hybrid/surfaces/main",
    order: 50,
  },
];

/** The classes that deploy to Cloudflare (wrangler). */
export const CLOUDFLARE = new Set(["next-cf", "worker-cf"]);

/** True when an app deploys to Cloudflare (vs a native store/installer). */
export const isCloudflare = (app) => CLOUDFLARE.has(app.class);

/**
 * Deployable apps in deploy order.
 * @param {{ only?: "cloudflare"|"all" }} [opts] default `cloudflare` — the common
 *   "ship several apps to CF" case; `all` includes expo/electron (which need their
 *   own credentials + runners).
 */
export function deployable({ only = "cloudflare" } = {}) {
  const list = only === "all" ? APPS : APPS.filter(isCloudflare);
  return [...list].sort(
    (a, b) => a.order - b.order || a.slug.localeCompare(b.slug),
  );
}

/** Every app of a given platform class. */
export const byClass = (cls) => APPS.filter((a) => a.class === cls);

// ── CLI: emit the app list for the CI matrix ──────────────────────────────────
//   node scripts/lib/apps.mjs [--json] [--cloudflare] [--class <next-cf|worker-cf|expo|electron>]
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const clsIdx = argv.indexOf("--class");
  let list = deployable({ only: "all" }); // registry order
  if (argv.includes("--cloudflare")) list = list.filter(isCloudflare);
  if (clsIdx >= 0) list = list.filter((a) => a.class === argv[clsIdx + 1]);
  if (argv.includes("--json")) {
    process.stdout.write(JSON.stringify(list));
  } else {
    for (const a of list) console.log(`${a.slug}\t${a.class}\t${a.pkg}`);
  }
}
