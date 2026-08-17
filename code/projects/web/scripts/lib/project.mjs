// Project-identity helpers shared by the deploy / secrets / backup / doctor
// scripts. The one namespace is `DEFAULT_SITE_PREFIX` (config, env-overridable via
// NEXT_PUBLIC_SITE_PREFIX); the Cloudflare resource names in `wrangler.toml` mirror
// it as `<prefix>-web*`. These read both so a shared-account deploy can't clobber
// another client under the template default. Scripts run from `code/projects/web`.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/** The wrangler resource stem the template SHIPS with — the "not renamed yet" sentinel. */
export const TEMPLATE_SLUG = "indiecrafts-web";

const WRANGLER = resolve("wrangler.toml");
const CONFIG_INDEX = resolve("../../packages/config/src/index.ts");
const ENV_LOCAL = resolve(".env.local");

function readFileOr(path, fallback = "") {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return fallback;
  }
}

/** The prod Worker name in `wrangler.toml` = the deploy slug (e.g. `indiecrafts-web`). */
export function getWranglerSlug() {
  const m = readFileOr(WRANGLER).match(/\[env\.prod\][\s\S]*?\n\s*name\s*=\s*"([^"]+)"/);
  return m ? m[1] : TEMPLATE_SLUG;
}

/** `DEFAULT_SITE_PREFIX` from `@indiecrafts/config` source (single source of truth for the prefix). */
export function readDefaultPrefix() {
  const m = readFileOr(CONFIG_INDEX).match(/DEFAULT_SITE_PREFIX\s*=\s*"([^"]+)"/);
  return m ? m[1] : "indiecrafts";
}

/** `NEXT_PUBLIC_SITE_PREFIX` from `.env.local`, if set (an env override wins over the config default). */
function readEnvPrefix() {
  const m = readFileOr(ENV_LOCAL).match(/^\s*NEXT_PUBLIC_SITE_PREFIX\s*=\s*(.+)\s*$/m);
  return m ? m[1].replace(/^["']|["']$/g, "").trim() || undefined : undefined;
}

/** The effective per-deployment prefix (env override, else the config default). */
export function readSitePrefix() {
  return readEnvPrefix() ?? readDefaultPrefix();
}

/**
 * Guard against a shared-Cloudflare-account clobber: refuse a staging/prod deploy
 * while the Worker + R2 names are still the template default. `dev` is exempt (the
 * template self-tests there); `ALLOW_DEFAULT_SLUG=true` lets the template's OWN
 * indiecrafts.dev deploy through. Exits non-zero with the fix.
 */
export function assertRenamed(env) {
  if (env === "dev" || process.env.ALLOW_DEFAULT_SLUG === "true") return;
  if (getWranglerSlug() === TEMPLATE_SLUG) {
    console.error(
      `✗ Refusing to deploy to ${env}: the Worker + R2 names are still the template default ` +
        `"${TEMPLATE_SLUG}".\n` +
        `  Deploying would OVERWRITE another client's Worker in a shared Cloudflare account.\n` +
        `  Run  pnpm project:rename <your-slug>  first (or set ALLOW_DEFAULT_SLUG=true for the template's own deploy).`,
    );
    process.exit(1);
  }
}
