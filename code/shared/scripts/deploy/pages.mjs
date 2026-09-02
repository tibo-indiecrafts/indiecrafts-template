// Deploy a static Cloudflare PAGES project (storybook) to one env. Same
// `deploy:<slug>:<env>` contract as the worker/next runners, but the target is
// Cloudflare Pages, not a Worker: it builds the static gallery, then
// `wrangler pages deploy`s it to the project `<prefix>-<env>-web-tools-storybook`
// (matching `resourceName`'s convention). Invoked from the storybook app dir, so
// `wrangler` (a devDep there) + `storybook-static` resolve against it.
//
//   node ../../../../shared/scripts/deploy/pages.mjs <dev|staging|prod> [--yes]
//
// The custom domain (a subdomain, e.g. `storybook.<root>`) lives in `domains.mjs`;
// Pages custom domains attach to the project (dashboard / DNS CNAME), not a route —
// this runner ships the deployment and prints the domain to attach.

import { ENVS } from "../lib/apps.mjs";
import { run, confirmProd } from "../lib/deploy-shared.mjs";
import { readSitePrefix } from "../lib/project.mjs";
import { domainFor, isConfigured } from "../lib/domains.mjs";

const env = process.argv[2];
const yes = process.argv.includes("--yes");
if (!ENVS.includes(env)) {
  console.error("Usage: pages.mjs <dev|staging|prod> [--yes]");
  process.exit(1);
}

// The Pages project name mirrors resourceName: `<prefix>-<env>-web-tools-storybook`.
// storybook is not an `apps.mjs` row (no wrangler/env-scoped bindings), so its tail is
// spelled out here rather than derived from a registry `dir`.
const prefix = readSitePrefix();
const project = `${prefix}-${env}-web-tools-storybook`;

await confirmProd("Deploy", "storybook", env, { yes });

// Build the static gallery, then ship it. `storybook:build` → ./storybook-static.
run("pnpm", ["run", "storybook:build"]);
run("wrangler", [
  "pages",
  "deploy",
  "storybook-static",
  "--project-name",
  project,
  "--branch",
  "main",
  "--commit-dirty=true",
]);

const domain = domainFor("storybook", env);
const url = isConfigured(domain)
  ? `https://${domain.host}`
  : `https://${project}.pages.dev`;
console.log(`✓ storybook: deployed to Pages "${project}" → ${url}`);
if (isConfigured(domain)) {
  console.log(
    `  ↳ attach the custom domain "${domain.host}" to this Pages project (dashboard → Custom domains, or a DNS CNAME).`,
  );
}
