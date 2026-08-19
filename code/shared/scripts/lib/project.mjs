// Project-identity helpers shared by the deploy / secrets / backup / doctor
// scripts across ALL apps. The one namespace is `DEFAULT_SITE_PREFIX` (config,
// env-overridable via NEXT_PUBLIC_SITE_PREFIX); each app's `wrangler.toml` mirrors
// it as `<prefix>-<app>*`. These guard a shared-account deploy from clobbering
// another client under the template default.
//
// Path reads are CWD-relative: every deploy/secrets script runs from its own app
// dir (`code/projects/<app>`), so `wrangler.toml` / `.env.local` resolve there and
// `../../packages/config` resolves to `code/packages/shared/config` from any app dir.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/** The wrangler resource stem the template SHIPS with for `web` — kept for `project-rename` (its base is `indiecrafts`). */
export const TEMPLATE_SLUG = "indiecrafts-web";

/** The "not renamed yet" sentinel for a given app (`indiecrafts-<app>`). */
export const templateSlug = (app) => `indiecrafts-${app}`;

const WRANGLER = resolve("wrangler.toml");
const CONFIG_INDEX = resolve("../../packages/shared/config/src/index.ts");
const ENV_LOCAL = resolve(".env.local");

function readFileOr(path, fallback = "") {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return fallback;
  }
}

/** The prod Worker name in the current app's `wrangler.toml` = its deploy slug. */
export function getWranglerSlug() {
  const m = readFileOr(WRANGLER).match(
    /\[env\.prod\][\s\S]*?\n\s*name\s*=\s*"([^"]+)"/,
  );
  return m ? m[1] : "";
}

/** `DEFAULT_SITE_PREFIX` from `@indiecrafts/config` source (single source of truth for the prefix). */
export function readDefaultPrefix() {
  const m = readFileOr(CONFIG_INDEX).match(
    /DEFAULT_SITE_PREFIX\s*=\s*"([^"]+)"/,
  );
  return m ? m[1] : "indiecrafts";
}

/** `NEXT_PUBLIC_SITE_PREFIX` from `.env.local`, if set (an env override wins over the config default). */
function readEnvPrefix() {
  const m = readFileOr(ENV_LOCAL).match(
    /^\s*NEXT_PUBLIC_SITE_PREFIX\s*=\s*(.+)\s*$/m,
  );
  return m ? m[1].replace(/^["']|["']$/g, "").trim() || undefined : undefined;
}

/** The effective per-deployment prefix (env override, else the config default). */
export function readSitePrefix() {
  return readEnvPrefix() ?? readDefaultPrefix();
}

/**
 * Guard against a shared-Cloudflare-account clobber: refuse a staging/prod deploy
 * while the current app's Worker + R2 names are still the template default
 * (`indiecrafts-<app>`). `dev` is exempt (the template self-tests there);
 * `ALLOW_DEFAULT_SLUG=true` lets the template's OWN deploy through. Exits non-zero.
 */
export function assertRenamed(app, env) {
  if (env === "dev" || process.env.ALLOW_DEFAULT_SLUG === "true") return;
  if (getWranglerSlug() === templateSlug(app)) {
    console.error(
      `✗ Refusing to deploy ${app} to ${env}: the Worker + R2 names are still the template default ` +
        `"${templateSlug(app)}".\n` +
        `  Deploying would OVERWRITE another client's Worker in a shared Cloudflare account.\n` +
        `  Run  pnpm project:rename <your-slug>  first (or set ALLOW_DEFAULT_SLUG=true for the template's own deploy).`,
    );
    process.exit(1);
  }
}
