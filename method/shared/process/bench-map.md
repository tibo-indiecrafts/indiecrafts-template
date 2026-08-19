# Agent reach-for map — agents × method phases

What every vendored agent is for, which phase it complements, and **when to reach for it**. **There is
no bench folder** — every agent lives in its **topic folder**, invokable by name. This map says which
agents are on the default hot path vs which are **options** you reach for by use-case (the content/growth
agents moved to the studio vault — § C). See [the registry](./my-skills-and-agents.md).

**Phase codes:** `02` Think · `03` Plan · `04` Build · `05` Review · `06` Test · `07` Ship ·
`08` Reflect · `X` cross-cutting (any phase). **Verdicts:** **Optional** (on-demand) ·
**Surface-gated** (dormant until a reserved surface lands) · **Growth** (moved to the vault) ·
**Situational** (overlaps a default agent, or off-stack — reach for it only when the use-case fits).

## A · Optional — on-demand, in a topic folder (no standing batch)

_These are **use-case-referenced** — they carry no standing phase-batch wire; reach for them only when
the trigger below fires._

| Agent                       | Phase | Reach for it when…                                               | Adds                                                                                              |
| --------------------------- | ----- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `tool-evaluator`            | 02    | choosing whether to adopt a new dep/library/service              | adopt-vs-avoid call; Think has no vendored agent                                                  |
| `ui-designer`               | 03    | a surface needs net-new visual design (tokens, type, layout)     | visual/design-system authoring (overlaps `interface-designer` + wired ux/design-system reviewers) |
| `interface-designer`        | 03    | wireframes / interaction flows before Build                      | UX + a11y authoring (overlaps `ui-designer`)                                                      |
| `modular-systems-architect` | 03    | a subsystem needs replaceable-module / black-box structure       | Eskil-Steenberg advice (overlaps wired `system-architect`)                                        |
| `design-reviewer`           | 03/05 | gating a design/spec before implementation                       | pre-impl validation (overlaps wired `architect-reviewer`)                                         |
| `config-expert`             | 04/07 | setting up env + secret hygiene (Sanity tokens, dev/prod parity) | _builds_ config hygiene (wired `config-consistency-reviewer` only _reviews_ it)                   |
| `code-commentator`          | X     | documenting a genuinely gnarly algorithm                         | inline "why-not-what" docs                                                                        |
| `build-engineer`            | X     | bundle size or build time measurably hurts                       | webpack/vite/turbo tuning (Next/Turbopack defaults cover most)                                    |
| `dx-optimizer`              | X     | the dev feedback loop is slow                                    | HMR/DX/tooling tuning (overlaps `build-engineer`)                                                 |
| `compliance-auditor`        | 05    | a GDPR / cookie-consent / privacy pass on forms + analytics      | the privacy slice only (HIPAA/PCI/SOC2 bulk is off-stack)                                         |

## B · Surface-gated — activate when a reserved surface lands

Referenced by a **stack-option** (registry PLAN/BUILD/TEST), so these live in their **topic
folder**, ready when the surface appears.

| Reserved surface                   | Agents                                                             | Role                                                                                                |
| ---------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `apps/api`                         | `api-designer` (03) · `backend-developer` (04) · `api-tester` (06) | contract → implementation → API tests; `api-designer` front-runs the wired `backend-architect`      |
| `code/shared/db`                   | `database-schema-designer` (03/04)                                 | schema + migrations + indexing (wired `data-architect` plans the model)                             |
| a CLI                              | `cli-developer`                                                    | arg parsing, terminal UX, completions                                                               |
| an MCP server                      | `mcp-developer`                                                    | JSON-RPC servers/clients, tools/resources                                                           |
| a mobile app (`apps/mobile`, expo) | `mobile-developer` · `mobile-app-builder`                          | React Native / Expo — `mobile-developer` is the default; `mobile-app-builder` its option-twin (§ D) |
| GraphQL                            | `graphql-architect`                                                | schema / federation / subscriptions (Sanity is GROQ-first)                                          |
| realtime                           | `websocket-engineer`                                               | WebSocket / pub-sub messaging                                                                       |

## C · Growth / GTM — the project lane's go-to-market stages

The **project lane** (run once per product, not part of the core build sprint). Maps to
[`launch-playbook.md`](./launch-playbook) stages + the [Project-lane registry](./my-skills-and-agents.md#project-lane-per-project-stages-run-once).

**Growth + content agents moved to the studio content vault** (`~/Code/indie-brain/.claude/agents/`) —
`growth-hacker` (AARRR anchor) + the channel agents (`instagram-curator` · `reddit-community-builder` ·
`tiktok-strategist` · `twitter-engager`) + `content-creator` / `app-store-optimizer`. This code framework
keeps only the **launch / experiment orchestration** agents:

| Agent                | Stage | Role                                                               |
| -------------------- | ----- | ------------------------------------------------------------------ |
| `project-shipper`    | 11    | launch orchestration — release calendar, go-to-market coordination |
| `uat-coordinator`    | 11    | go-live sign-off — business-user acceptance before launch          |
| `experiment-tracker` | 12    | post-launch A/B + feature-flag experiment tracking                 |

**Situational:** `studio-producer` (team/multi-project orchestration — a solo workflow rarely needs it; see § D).

## D · Situational — categorised, reach for by use-case

Kept + categorised (no bench). Not on the default hot path; reach for one when its trigger fires.

| Agent                                                                                        | Reach for it when…                                                                                                                                                    |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `electron-pro`                                                                               | building the **`apps/hybrid`** (electron) slot                                                                                                                        |
| `mobile-app-builder`                                                                         | building the **`apps/mobile`** (expo) slot — option-twin of `mobile-developer`                                                                                        |
| `ai-engineer`                                                                                | a feature is genuinely AI/ML-heavy (RAG, model serving, evals)                                                                                                        |
| `microservices-architect` · `wordpress-master` · `chaos-engineer`                            | off-stack — only if the project adds that surface (distributed services · WordPress · chaos/distributed infra)                                                        |
| `architecture-consultant` · `performance-optimizer` · `tech-writer` · `git-workflow-manager` | the wired default doesn't fit — each overlaps `system-architect` · `performance-benchmarker` · `documentation-engineer` · `git-manager` (reach for the default first) |
| `project-template-manager` · `agent-coordinator`                                             | multi-agent routing beyond the explicit phase batches (rarely — the batches usually suffice)                                                                          |
| `studio-producer` · `training-change-manager`                                                | team/org orchestration (a solo flow rarely needs them)                                                                                                                |
