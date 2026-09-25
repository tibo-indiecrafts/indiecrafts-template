#!/usr/bin/env node
/**
 * PostToolUse (Edit|Write|MultiEdit) — redeploy-to-dev signal.
 *
 * `pnpm dev` runs the workers as `wrangler dev --env dev --remote` and the website as
 * `next dev` — so most edits HOT-RELOAD locally. But some changes only take effect after an
 * explicit command (and the *deployed* `indiecrafts-dev-*` Workers stay stale until then).
 * This card fires on exactly those "run a command or it won't take effect on dev" edits and
 * names the command. Advisory — never blocks. The gate is still the deploy scripts + CI.
 */
import { readFileSync } from "node:fs";

let input = {};
try {
  input = JSON.parse(readFileSync(0, "utf8"));
} catch {
  process.exit(0);
}
const file = input?.tool_input?.file_path ?? "";
if (!file) process.exit(0);

// surface → its dev commands
function surfaceOf(f) {
  const S = {
    "code/shared/api/": {
      name: "api worker",
      deploy: "deploy:shared:api:dev",
      secrets: "secrets:sync:shared:api:dev",
      infra: "infra:shared:api:apply:dev",
      worker: true,
    },
    "code/shared/cron/": {
      name: "cron worker",
      deploy: "deploy:shared:cron:dev",
      secrets: "secrets:sync:shared:cron:dev",
      worker: true,
      cron: true,
    },
    "code/shared/workers/": {
      name: "workers",
      deploy: "deploy:shared:workers:dev",
      secrets: "secrets:sync:shared:workers:dev",
      worker: true,
      cron: true,
    },
    "code/shared/infra/": {
      name: "shared infra",
      infra: "infra:shared:account:apply:dev",
    },
    "code/projects/web/surfaces/website/": {
      name: "website",
      deploy: "deploy:web:website:dev",
      secrets: "secrets:sync:web:website:dev",
      infra: "infra:web:website:apply:dev",
      nextcf: true,
    },
    "code/projects/web/surfaces/admin/": {
      name: "admin",
      deploy: "deploy:web:admin:dev",
      secrets: "secrets:sync:web:admin:dev",
      infra: "infra:web:admin:apply:dev",
      nextcf: true,
    },
    "code/projects/web/surfaces/app/": {
      name: "app",
      deploy: "deploy:web:app:dev",
      secrets: "secrets:sync:web:app:dev",
      infra: "infra:web:app:apply:dev",
      nextcf: true,
    },
    "code/projects/web/tools/storybook/": {
      name: "storybook",
      deploy: "deploy:web:storybook:dev",
      infra: "infra:web:storybook:apply:dev",
    },
  };
  for (const [k, v] of Object.entries(S)) if (f.includes(k)) return v;
  return null;
}

const s = surfaceOf(file);
const base = file.split("/").pop() || file;
let card = null;

if (/\/wrangler\.toml$/.test(file) && s) {
  card = `⚙ ${s.name} \`wrangler.toml\` — a binding/config change does NOT hot-reload: restart \`pnpm dev\` locally, and \`pnpm ${s.deploy}\` to update the deployed dev Worker. If you added a D1/KV/R2/queue binding, run \`cf-typegen\` first.`;
} else if (/(\/migrations\/|\.sql$)/.test(file)) {
  card = `🗄 D1 migration — \`pnpm db:migrate:all:dev\` applies it to the shared remote dev D1 (both \`pnpm dev\` and the deployed Workers read it; a pre-migration R2 snapshot is taken).`;
} else if (/\/\.dev\.vars$/.test(file) && s) {
  card = s.nextcf
    ? `🔑 ${s.name} \`.dev.vars\` — \`pnpm ${s.secrets}\` to push to the deployed dev Worker. NOTE: \`dev:refresh:dev\` / \`secrets:sync:all:dev\` are workers-only and SKIP next-cf secrets.`
    : `🔑 ${s.name} \`.dev.vars\` — restart \`pnpm dev\` (the local \`--remote\` session reads it) and \`pnpm ${s.secrets}\` (or \`pnpm dev:refresh:dev\`) for the deployed dev Worker.`;
} else if (/\.(tf|tfvars)$/.test(file) && s?.infra) {
  card = `🌐 ${s.name} Terraform (edge WAF/DNS/cache) — \`pnpm ${s.infra}\`. Terraform is NOT covered by \`deploy:all:dev\` or \`dev:refresh:dev\`, and there is no drift check — re-apply per stack after any \`.tf\`/\`.tfvars\` change.`;
} else if (s?.cron && /\/src\//.test(file)) {
  card = `⏰ ${s.name} \`${base}\` — cron/background logic + \`[triggers]\` do NOT run during \`pnpm dev\` (only via \`curl localhost:8787/__scheduled\`) and the hosted dev schedule is stale until \`pnpm ${s.deploy}\`.`;
} else if (s?.worker && /\/src\//.test(file)) {
  card = `↻ ${s.name} \`${base}\` — hot-reloads in your local \`wrangler dev --remote\`; the deployed \`indiecrafts-dev\` ${s.name} stays stale (anything hitting it directly sees old code) until \`pnpm ${s.deploy}\`.`;
}

if (!card) process.exit(0);
process.stdout.write(`[redeploy→dev] ${card}`);
process.exit(0);
