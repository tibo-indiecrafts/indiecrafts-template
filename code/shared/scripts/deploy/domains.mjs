#!/usr/bin/env node
// Domain helper — reads the domain registry (`../lib/domains.mjs`) and PRINTS the
// derived config for an app+env to paste. Static TOML/tfvars are edited by hand
// (like `infra/bindings.mjs`), so the registry stays the source and you paste once:
//
//   print <app> <env>   → the wrangler `[[env.<env>.routes]]` block + the tfvars domain lines
//   url   <app> <env>   → the runtime origin (`NEXT_PUBLIC_SITE_URL`), or empty
//
//   node code/shared/scripts/deploy/domains.mjs print website prod

import {
  ENVS,
  domainFor,
  originFor,
  hostsFor,
  isConfigured,
} from "../lib/domains.mjs";

const [action, app, env] = process.argv.slice(2);
const ACTIONS = ["print", "url"];
if (!ACTIONS.includes(action) || !app || !ENVS.includes(env)) {
  console.error("usage: domains.mjs <print|url> <app> <dev|staging|prod>");
  process.exit(1);
}

if (action === "url") {
  process.stdout.write(originFor(app, env)); // empty when no custom domain
  process.exit(0);
}

// print
const d = domainFor(app, env);
if (!isConfigured(d)) {
  console.log(
    `${app} (${env}) has no custom domain (serves *.workers.dev). Add a host to the "${app}" row in code/shared/scripts/lib/domains.mjs.`,
  );
  process.exit(0);
}
const hosts = hostsFor(app, env);
console.log(
  `── ${app} (${env}) — host ${d.host}${d.aliases?.length ? " + " + d.aliases.join(", ") : ""} ──\n`,
);
console.log(
  `⚠ Attach the domain with ONE of the two options below — never both (they would\n` +
    `  each claim the hostname on the Worker and fight each other).\n`,
);
console.log(`# ── Option A — Terraform owns the domain (recommended; it also owns`);
console.log(`#    the WAF / rate-limit / cache / SSL / Turnstile). Set in`);
console.log(`#    infra/cloudflare/env/${env}.tfvars, then \`pnpm infra:${app}:apply:${env}\`:`);
console.log(`attach_domain     = true`);
console.log(`domain            = "${d.host}"`);
console.log(`zone_id           = ""   # the zone id for ${d.zone ?? d.host}`);
console.log(`turnstile_domains = [${hosts.map((h) => `"${h}"`).join(", ")}]`);
console.log(
  `\n# ── Option B — wrangler owns the domain (ONLY if you deploy WITHOUT the infra/`,
);
console.log(`#    layer). Then set \`attach_domain = false\` in the tfvars above.`);
console.log(`#    Paste under [env.${env}] in wrangler.toml:`);
for (const h of hosts)
  console.log(`# [[env.${env}.routes]]\n# pattern = "${h}"\n# custom_domain = true`);
console.log(
  `\n# runtime (deploy exports this automatically): NEXT_PUBLIC_SITE_URL=${originFor(app, env)}`,
);
