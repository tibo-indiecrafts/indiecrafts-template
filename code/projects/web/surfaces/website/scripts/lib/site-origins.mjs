/**
 * The website's origins, prod first, then local dev — the sites the Studio previews
 * (`sanity.cli.ts`) and the origins Sanity's CORS list must allow (`sanity-setup.mjs`).
 *
 * @see docs/reference/projects/web/website/scripts/lib/site-origins.md
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { ENVS } from "../../../../../../shared/scripts/lib/apps.mjs";
import { envVars } from "../../../../../../shared/scripts/lib/deploy-shared.mjs";
import { originFor } from "../../../../../../shared/scripts/lib/domains.mjs";

export const LOCAL_ORIGIN = "http://localhost:3000";

const WRANGLER = fileURLToPath(new URL("../../wrangler.toml", import.meta.url));

/**
 * Each env's website origin — its `wrangler.toml` `NEXT_PUBLIC_SITE_URL`, else the domain
 * registry — prod first, then {@link LOCAL_ORIGIN}. Unique; an env with neither is skipped.
 */
export function siteOrigins(toml = readFileSync(WRANGLER, "utf8")) {
  const urls = [...ENVS]
    .reverse()
    .map((env) => envVars(toml, env).NEXT_PUBLIC_SITE_URL || originFor("website", env));
  return [
    ...new Set([...urls, LOCAL_ORIGIN].filter(Boolean).map((url) => new URL(url).origin)),
  ];
}
