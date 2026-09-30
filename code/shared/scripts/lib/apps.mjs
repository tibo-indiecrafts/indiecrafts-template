// The app registry — the single source of truth for "which apps exist, what
// platform each targets, and in what order they deploy." Every deploy runner,
// the deploy-all orchestrator, project-rename, and CI read this instead of
// re-deriving it (previously: scan `code/projects/*/wrangler.toml`, which can't
// see non-Cloudflare apps).
//
// Adding an app = one row here + its own `deploy:<slug>:<env>` script. That's it.
//
// Platform classes:
//   next-cf   — Next.js → OpenNext → Cloudflare Workers (website · admin)
//   worker-cf — a bare Cloudflare Worker (api · cron · workers)
//   capacitor — the Capacitor shell around the app surface (mobile) — NOT deployed by these runners
//
// CLI (for the CI matrix): `node scripts/lib/apps.mjs --json [--cloudflare]`

import { fileURLToPath } from "node:url";

/** The deploy environments every Cloudflare app supports. */
export const ENVS = ["dev", "staging", "prod"];

/**
 * @typedef {Object} AppEntry
 * @property {string} slug   short id + `deploy:<slug>:<env>` script name
 * @property {string} pkg    the workspace package name (`pnpm --filter` target)
 * @property {"next-cf"|"worker-cf"|"capacitor"} class  platform class → deploy recipe
 * @property {"web"|"mobile"|"shared"} platform  which platform folder it lives under
 * @property {"surface"|"service"|"tool"} kind  surface (a user-facing site/screen/app) · service (a worker backend) · tool (dev tooling, e.g. storybook)
 * @property {string} dir    the project's directory — `code/projects/<platform>/<kind>s/<leaf>`.
 *   The leaf can differ from `slug` (e.g. slug `mobile` lives at `mobile/surfaces/main`), so every
 *   path resolver reads THIS, never `code/projects/<slug>` (dirs nest by platform → kind).
 * @property {number} order  deploy order (low first: services before their consumers)
 * @property {{ path: string, contains: string }} [smoke]  optional post-deploy functional
 *   probe: after the root reachability check, the deploy GETs `<custom-domain><path>` and
 *   fails if the body does not contain `contains` — proving the runtime + the freshly
 *   deployed build actually serve the expected payload, not just that the edge returns 200.
 *   Omit for an app with no health/version route (root reachability only).
 */

/** @type {AppEntry[]} */
export const APPS = [
  {
    slug: "api",
    pkg: "@indiecrafts/shared-api",
    class: "worker-cf",
    platform: "shared",
    kind: "service",
    dir: "code/shared/api",
    order: 10,
    smoke: { path: "/health", contains: "ok" },
  },
  {
    slug: "cron",
    pkg: "@indiecrafts/shared-cron",
    class: "worker-cf",
    platform: "shared",
    kind: "service",
    dir: "code/shared/cron",
    order: 10,
  },
  {
    slug: "workers",
    pkg: "@indiecrafts/shared-workers",
    class: "worker-cf",
    platform: "shared",
    kind: "service",
    dir: "code/shared/workers",
    order: 10,
    smoke: { path: "/health", contains: "ok" },
  },
  {
    slug: "website",
    pkg: "@indiecrafts/web-surfaces-website",
    class: "next-cf",
    platform: "web",
    kind: "surface",
    dir: "code/projects/web/surfaces/website",
    order: 30,
    smoke: { path: "/api/version", contains: "version" },
  },
  {
    slug: "admin",
    pkg: "@indiecrafts/web-surfaces-admin",
    class: "next-cf",
    platform: "web",
    kind: "surface",
    dir: "code/projects/web/surfaces/admin",
    order: 40,
  },
  {
    slug: "app",
    pkg: "@indiecrafts/web-surfaces-app",
    class: "next-cf",
    platform: "web",
    kind: "surface",
    dir: "code/projects/web/surfaces/app",
    order: 45,
    smoke: { path: "/api/version", contains: "version" },
  },
  {
    // Storybook is a Cloudflare Worker serving STATIC ASSETS (Workers Static Assets, no
    // `main`), not a bare-logic worker: its `deploy:storybook:<env>` script builds the
    // gallery first, then runs the shared worker runner (`wrangler deploy`). class
    // `worker-cf` keeps it in the Cloudflare deploy set; `kind: tool` marks it a tool, not
    // a user surface. Deploys last (order 60) — nothing depends on it.
    slug: "storybook",
    pkg: "@indiecrafts/web-tools-storybook",
    class: "worker-cf",
    platform: "web",
    kind: "tool",
    dir: "code/projects/web/tools/storybook",
    order: 60,
  },
  {
    slug: "mobile",
    pkg: "@indiecrafts/mobile-surfaces-main",
    class: "capacitor",
    platform: "mobile",
    kind: "surface",
    dir: "code/projects/mobile/surfaces/main",
    order: 50,
  },
];

/** The classes that deploy to Cloudflare (wrangler). */
export const CLOUDFLARE = new Set(["next-cf", "worker-cf"]);

/** True when an app deploys to Cloudflare. */
export const isCloudflare = (app) => CLOUDFLARE.has(app.class);

/**
 * Deployable apps in deploy order — the Cloudflare apps. The Capacitor shell has no
 * release pipeline yet (it ships with the App Store spec), so it is never deployed here.
 */
export function deployable() {
  return APPS.filter(isCloudflare).sort(
    (a, b) => a.order - b.order || a.slug.localeCompare(b.slug),
  );
}

/** Every app of a given platform class. */
export const byClass = (cls) => APPS.filter((a) => a.class === cls);

/** Find an app row by slug. */
export const bySlug = (slug) => APPS.find((a) => a.slug === slug);

/**
 * The Cloudflare resource name for an app in one env — the SINGLE source of the
 * naming convention. It mirrors the folder tree: **`<prefix>-<env>-<tail>`**, where
 * `<tail>` is the app's `dir` under `code/` with a leading `projects/` stripped,
 * dash-joined — the same tail as the npm package name (`@indiecrafts/<tail>`).
 * (env-first; prod is explicit, not bare). Examples:
 *   website → `indiecrafts-prod-web-surfaces-website`  (code/projects/web/surfaces/website)
 *   api     → `indiecrafts-dev-shared-api`             (code/shared/api)
 * Every wrangler `name`, the R2/KV/D1 stems, and the tfvars `worker_name` derive
 * from here, so a client rename only swaps `<prefix>` (see `project-rename`).
 * @param {string} slug  an `APPS` row slug
 * @param {"dev"|"staging"|"prod"} env
 * @param {string} prefix  the deployment namespace (`DEFAULT_SITE_PREFIX`, e.g. `indiecrafts`, or a client slug)
 * @returns {string}
 */
export function resourceName(slug, env, prefix) {
  const app = bySlug(slug);
  if (!app) throw new Error(`resourceName: unknown app slug "${slug}"`);
  if (!ENVS.includes(env)) throw new Error(`resourceName: bad env "${env}"`);
  if (!prefix) throw new Error("resourceName: a prefix is required");
  const tail = app.dir
    .replace(/^code\//, "")
    .replace(/^projects\//, "")
    .replaceAll("/", "-");
  return `${prefix}-${env}-${tail}`;
}

// ── CLI: emit the app list for the CI matrix ──────────────────────────────────
//   node scripts/lib/apps.mjs [--json] [--cloudflare] [--class <next-cf|worker-cf|capacitor>]
//                             [--kind <surface|service|tool>]
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const clsIdx = argv.indexOf("--class");
  const kindIdx = argv.indexOf("--kind");
  let list = [...APPS].sort(
    (a, b) => a.order - b.order || a.slug.localeCompare(b.slug),
  ); // registry order
  if (argv.includes("--cloudflare")) list = list.filter(isCloudflare);
  if (clsIdx >= 0) list = list.filter((a) => a.class === argv[clsIdx + 1]);
  if (kindIdx >= 0) list = list.filter((a) => a.kind === argv[kindIdx + 1]);
  if (argv.includes("--json")) {
    process.stdout.write(JSON.stringify(list));
  } else {
    for (const a of list) console.log(`${a.slug}\t${a.class}\t${a.pkg}`);
  }
}
