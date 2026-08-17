# MCP servers

The committed **`.mcp.json`** declares the Model-Context-Protocol servers that spawn for **every**
client site — the connectors the agent uses to work the stack. Per-developer productivity tools
(`codegraph`, `headroom`) deliberately stay **out** of `.mcp.json` so a client site never depends on
them; the servers below are project-universal (every site has Sanity, deploys via Cloudflare + Vercel
docs, and can grow the Terraform edge).

**Secrets never live in the file.** Env values use `${VAR}` interpolation, resolved from the shell —
so `.mcp.json` is safe to commit. Manage connections with **`/mcp`** (reconnect · enable · disable ·
OAuth).

| Server | Type | What it's for | Needs |
| --- | --- | --- | --- |
| `shadcn` | stdio (`npx`) | shadcn/ui registry — add/inspect primitives | — |
| `magicui` | stdio (`npx`) | Magic UI component registry | — |
| **`sanity`** | stdio (`npx @sanity/mcp-server`) | query + edit the CMS (content ops, GROQ, schema-aware) | `NEXT_PUBLIC_SANITY_PROJECT_ID` · `NEXT_PUBLIC_SANITY_DATASET` · `SANITY_API_READ_TOKEN` (env) |
| **`terraform`** | stdio (`docker … hashicorp/terraform-mcp-server`) | live Terraform **registry + provider docs** — accurate `cloudflare` resource schemas for `code/infra/iac/` | **Docker** running (read-only; no CF creds) |
| **`vercel`** | http (`mcp.vercel.com`) | the **docs site** deploys to Vercel — deployments, logs, project ops | OAuth on first connect |
| **`supabase`** | stdio (`npx @supabase/mcp-server-supabase`) | query a Supabase project (DB · schema · branches) — runs **`--read-only`** + pinned to one `--project-ref` | `SUPABASE_ACCESS_TOKEN` + `SUPABASE_PROJECT_REF` (env). Not in the stack today (Sanity + Cloudflare D1) — available for a Supabase-backed app/lens. |

## Notes

- **Sanity** defaults to the **read** token (`SANITY_API_READ_TOKEN`) — the agent can *read* content
  safely. To let it **write** (create/patch docs), point `SANITY_API_TOKEN` at a write token **and a
  non-production dataset** — an agent editing a live prod dataset is a real risk. `MCP_USER_ROLE` is
  `developer`.
- **Terraform** MCP is registry/provider **documentation** — it does not touch your Cloudflare account
  (that's `CLOUDFLARE_API_TOKEN` + `pnpm infra:web:*`). It exists so IaC schemas are current, not
  hallucinated. Requires a local Docker daemon; if Docker is absent the server just doesn't connect.
- **Vercel** is a remote HTTP MCP (hosted by Vercel) — the docs site's deploy target
  (`docs/.vitepress` → Vercel). The app itself deploys to **Cloudflare** via `wrangler`, not here.
- Cloudflare also publishes MCP servers (docs · workers-bindings · observability); add them the same
  way if the agent should query CF at runtime.

## Optional: diagramming, slides & icons — `koboyo` (opt-in — not committed)

[koboyo](https://koboyo.com) is a **per-developer** MCP (like `codegraph`/`headroom`) — it needs a
personal account token, so it stays **out** of `.mcp.json`. It draws diagrams and slide decks onto a
real, editable canvas and searches a 70k hand-drawn SVG icon library. Three tool groups:

| Group | Tools | Use it for |
| --- | --- | --- |
| **Diagrams** | `get_syntax` · `create_diagram` · `update_diagram` · `get_diagram` · `list_canvases` · `whoami` | architecture · flowchart · sequence · erd · statemachine · wireframe · bpmn · mindmap · gantt (18 kinds). Returns an edit link, light/dark embed URLs for a README, and the rendered PNG inline. Frames stay editable by a human. |
| **Slides** | `create_slides` · `add_slide` | a designed deck — one editable slide per frame, full-screen presentable, PDF-exportable. You write content + accent hue; the server designs. |
| **Icons** | `find_icons_for` · `search_icons` · `get_icon_svg` · `list_categories` · `list_icons` · `get_icon` | 70k monochrome (`fill="currentColor"`) SVG icons. `find_icons_for(['home','billing',…])` matches many concepts in one call. |

**Add it (per machine, per account):**

```bash
# get the token from your koboyo account, then:
claude mcp add --transport http koboyo https://api.koboyo.com/v1-mcp \
  --header "Authorization: Bearer $KOBOYO_TOKEN"
```

- **The token is a secret** — it lands in `~/.claude.json` (local, project-scoped), never the repo.
  Do not paste the literal `kbi_…` value into any tracked file; use `$KOBOYO_TOKEN` in docs.
- **Not Mermaid.** The diagram DSL is koboyo's own — call `get_syntax({ kind })` before a kind you
  have not written. Mermaid is accepted and translated, but loses detail.
- **Targeting.** The server is stateless — call `whoami` first to find the workspace/canvas to
  write to; there is no "select workspace" call.

## Optional: security MCPs (opt-in — not committed)

SonarQube + Snyk both ship MCP servers. They're **not** in the committed `.mcp.json` — like
`codegraph`/`headroom`, they need a per-account token most client sites won't have, so committing
them would spawn a failing server for everyone. Add them per-machine when a project uses them
(`claude mcp add …`, or paste into `.mcp.json` with the env in your shell):

```jsonc
// Snyk — SCA (deps) + SAST. `snyk_sca_test` / `snyk_code_test`. Needs SNYK_TOKEN.
"snyk": { "type": "stdio", "command": "npx", "args": ["-y", "snyk", "mcp", "-t", "stdio"],
          "env": { "SNYK_TOKEN": "${SNYK_TOKEN}" } }

// SonarQube (Cloud) — code quality + security issues. Needs a USER token + org. Docker.
"sonarqube": { "type": "stdio", "command": "docker",
  "args": ["run","-i","--rm","--init","-e","SONARQUBE_TOKEN","-e","SONARQUBE_ORG","sonarsource/sonarqube-mcp"],
  "env": { "SONARQUBE_TOKEN": "${SONARQUBE_TOKEN}", "SONARQUBE_ORG": "${SONARQUBE_ORG}" } }
// Self-hosted SonarQube: swap SONARQUBE_ORG → SONARQUBE_URL.
```

**MCPs are agent-loop tools, not hooks.** A Claude Code **hook runs a shell command** and can't call
an MCP server — so there is no "hook that fires the Snyk/Sonar MCP". For **automatic** scanning wire
the underlying **CLI** in a hook (the way `a11y-check.mjs` wraps `eslint`):

- **Snyk — hookable.** `snyk code test` (SAST) / `snyk test` (deps) run per-edit or on `Stop`/commit
  and print findings as cards. Needs the `snyk` CLI + `SNYK_TOKEN`. This is the real "security on the
  fly" — see [on-the-fly checks](../../apps/web/setup/on-the-fly-checks.md).
- **SonarQube — not a per-edit hook.** It needs a scanner + a running server (full-project scan), so
  use its **MCP** (on-demand, in-loop) or a **CI gate** (`sonar-scanner`), not a `PostToolUse` hook.

## Optional: go-to-market MCPs (opt-in — plugin servers, not committed)

The **project-lane** GTM stages ([`launch-playbook.md`](../process/launch-playbook)) fire once a real
product ships — so their connectors are **on-demand plugin MCP servers**, not in `.mcp.json` (a
client site never needs them, and each needs a per-account OAuth). Enable + `authenticate` the ones
a product actually uses, per stage. **No secrets in the repo — OAuth is per-account, per-machine.**

| Stage | MCP | What it's for |
| --- | --- | --- |
| 3 Validate | `ahrefs` · `similarweb` | keyword/SEO gaps · competitor traffic |
| 6 GTM | `hubspot` · `klaviyo` | CRM/marketing automation · email lists + flows |
| 6 GTM | `notion` · `canva` · `figma` | content ops · creative assets |
| 6 GTM | `slack` | community / launch-platform presence |
| 6 GTM · outreach | `apollo` · `clay` · `zoominfo` | build + enrich the outreach list |
| 7 Legal | `docusign` · `atlassian` | signatures · legal ops |
| 12 Grow | `amplitude` · `pendo` · `supermetrics` | product analytics · marketing-data warehouse |
| 12 Grow · data | `bigquery` · `hex` · `definite` | SQL warehouse · notebooks · metrics |
| 6/11 Sales (outbound) | `apollo` · `close` · `outreach` · `fireflies` | outbound CRM · call notes |

**How to enable:** these ship as **plugin** MCP servers (installed plugin marketplace, e.g.
`mcp__plugin_marketing_*` · `mcp__plugin_sales_*` · `mcp__plugin_data_*`). Turn one on when you reach
its stage, then run its `authenticate` flow (OAuth in the browser). They stay dormant — zero cost —
until enabled. Reach for the matching **skill** first (`pm-go-to-market:*` · `marketing:*` ·
`sales:*` · `data:*`); add the MCP only when the skill needs live account data.

## Where they fit

- `sanity` ↔ the CMS work across `code/modules/blog`, `code/packages/sanity`, the SEO singletons.
- `terraform` ↔ [`docs/apps/web/setup/cloudflare-iac.md`](../../../docs/apps/web/setup/cloudflare-iac.md) + `code/infra/iac/cloudflare/`.
- `vercel` ↔ the docs-site deployment.
- **GTM MCPs** ↔ the project lane's [`launch-playbook.md`](../process/launch-playbook) stages 3/6/7/12.
- **`koboyo`** ↔ **PLAN** (architecture/ERD/sequence diagrams) · **BUILD** + Design system (UI icons) ·
  **GTM/Launch** (pitch + explainer slide decks). Mapped per phase in
  [`my-skills-and-agents.md`](../process/my-skills-and-agents).
