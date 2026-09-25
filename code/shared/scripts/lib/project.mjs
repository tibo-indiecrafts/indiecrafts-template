// Project-identity helpers shared by the deploy / secrets / backup / doctor
// scripts across ALL apps. The one namespace is `DEFAULT_SITE_PREFIX` (config,
// env-overridable via NEXT_PUBLIC_SITE_PREFIX); every Cloudflare resource name is
// `<prefix>-<env>-<platform>-<slug>` (see `resourceName` in apps.mjs), so a client
// rename only swaps `<prefix>`. The clobber guard refuses a staging/prod deploy
// while a name is still on the template prefix.
//
// Per-app files (`wrangler.toml`, `.env.local`) are CWD-relative (each deploy
// script runs from its own app dir). The one shared file (`@indiecrafts/packages-shared-config`)
// resolves against THIS script's location instead, so it is correct whether the
// caller runs from a 4-deep surface or a 2-deep shared service.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { resourceName } from "./apps.mjs";

/** The namespace the template SHIPS with. A client swaps it via `project-rename`; the clobber guard treats any name still on this prefix as "not renamed". */
export const TEMPLATE_PREFIX = "indiecrafts";

/** Assignment lines whose quoted value carries the prefix — the resource-name lines a
 *  rename rewrites. `dataset` = an Analytics Engine dataset name (else it drifts on rename);
 *  `BACKUP_BUCKET` = the R2 backup-bucket name carried as a `[vars]` string (the backup
 *  script reads it), so it must rename too or a client's backups target the template bucket. */
const RESOURCE_LINE =
  /^\s*(name|bucket_name|database_name|dataset|service|queue|worker_name|BACKUP_BUCKET)\s*=/;

/**
 * Swap the resource-name `<from>-` prefix → `<to>-` across a wrangler.toml / tfvars body.
 * Two line kinds carry the prefix: (1) a quoted resource VALUE on a `name` / `database_name`
 * / `dataset` / … assignment; (2) a `wrangler … create <from>-…` COMMENT example — rewritten
 * too, so a renamed project's copy-paste create commands produce correctly-named resources.
 * Prose comments are left untouched (only the create-command examples match).
 */
export function renameResourcePrefix(text, from, to) {
  return text
    .split("\n")
    .map((line) => {
      if (RESOURCE_LINE.test(line))
        return line.replaceAll(`"${from}-`, `"${to}-`);
      if (/^\s*#/.test(line) && /\bcreate\b/.test(line))
        return line.replaceAll(`${from}-`, `${to}-`);
      return line;
    })
    .join("\n");
}

// `wrangler.toml` + `.env.local` are per-app → CWD-relative (each deploy script
// runs from its own app dir). The config is ONE shared file → resolve it against
// THIS script's location, so it's correct from any app depth (surfaces are 4 deep,
// shared services 2 deep — a single CWD-relative path can't serve both).
const WRANGLER = resolve("wrangler.toml");
const ENV_LOCAL = resolve(".env.local");
const HERE = dirname(fileURLToPath(import.meta.url)); // code/shared/scripts/lib
// The file that DEFINES `DEFAULT_SITE_PREFIX` (the rename target). It lives in
// `src/web/site.ts`; `src/index.ts` only RE-EXPORTS it, so pointing here is required —
// otherwise the rename finds no assignment and aborts ("nothing changed").
export const CONFIG_INDEX = resolve(
  HERE,
  "../../../packages/shared/config/src/web/site.ts",
);

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

/** `DEFAULT_SITE_PREFIX` from `@indiecrafts/packages-shared-config` source (single source of truth for the prefix). */
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
 * while the app's Worker + R2 names are still on the template prefix
 * (`indiecrafts-<env>-<platform>-<slug>`). Works for EVERY app — it compares the
 * app's prod name against `resourceName(app, "prod", TEMPLATE_PREFIX)`, so there is
 * no per-app special case (the old `web`-vs-`website` mismatch that left the flagship
 * unguarded is gone). `dev` is exempt (the template self-tests there);
 * `ALLOW_DEFAULT_SLUG=true` lets the template's OWN deploy through. Exits non-zero.
 */
export function assertRenamed(app, env) {
  if (env === "dev" || process.env.ALLOW_DEFAULT_SLUG === "true") return;
  const templateName = resourceName(app, "prod", TEMPLATE_PREFIX);
  if (getWranglerSlug() === templateName) {
    console.error(
      `✗ Refusing to deploy ${app} to ${env}: the Worker + R2 names are still the template default ` +
        `"${templateName}".\n` +
        `  Deploying would OVERWRITE another client's Worker in a shared Cloudflare account.\n` +
        `  Run  pnpm project:rename <your-slug>  first (or set ALLOW_DEFAULT_SLUG=true for the template's own deploy).`,
    );
    process.exit(1);
  }
}
