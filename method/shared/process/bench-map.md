# Bench map — agents × method phases

What every vendored agent is for, which phase it complements, and **when to reach for it**.
`.claude/agents/bench/` holds **only the § D "Skip" agents** — those redundant with a wired agent
or off-stack; still discovered + invokable by name, just parked. Every agent a method step names —
the **Optional** use-case set (§ A), the **Surface-gated** stack-options (§ B), and the **Growth/GTM**
lane (§ C) — lives in its **topic folder** (outside bench). See [the registry](./my-skills-and-agents.md).

**Phase codes:** `02` Think · `03` Plan · `04` Build · `05` Review · `06` Test · `07` Ship ·
`08` Reflect · `X` cross-cutting (any phase). **Verdicts:** **Optional** (on-demand) ·
**Surface-gated** (dormant until a reserved surface lands) · **Growth** (post-Ship lane) ·
**Skip** (redundant with a wired agent, or off-stack — don't reach for it).

## A · Optional — on-demand, in a topic folder (no standing batch)

_These are **use-case-referenced**, so they live in their topic folder (not bench) — but they carry
no standing phase-batch wire; reach for them only when the trigger below fires._


| Agent | Phase | Reach for it when… | Adds |
| --- | --- | --- | --- |
| `tool-evaluator` | 02 | choosing whether to adopt a new dep/library/service | adopt-vs-avoid call; Think has no vendored agent |
| `ui-designer` | 03 | a surface needs net-new visual design (tokens, type, layout) | visual/design-system authoring (overlaps `interface-designer` + wired ux/design-system reviewers) |
| `interface-designer` | 03 | wireframes / interaction flows before Build | UX + a11y authoring (overlaps `ui-designer`) |
| `modular-systems-architect` | 03 | a subsystem needs replaceable-module / black-box structure | Eskil-Steenberg advice (overlaps wired `system-architect`) |
| `design-reviewer` | 03/05 | gating a design/spec before implementation | pre-impl validation (overlaps wired `architect-reviewer`) |
| `config-expert` | 04/07 | setting up env + secret hygiene (Sanity tokens, dev/prod parity) | *builds* config hygiene (wired `config-consistency-reviewer` only *reviews* it) |
| `code-commentator` | X | documenting a genuinely gnarly algorithm | inline "why-not-what" docs |
| `build-engineer` | X | bundle size or build time measurably hurts | webpack/vite/turbo tuning (Next/Turbopack defaults cover most) |
| `dx-optimizer` | X | the dev feedback loop is slow | HMR/DX/tooling tuning (overlaps `build-engineer`) |
| `compliance-auditor` | 05 | a GDPR / cookie-consent / privacy pass on forms + analytics | the privacy slice only (HIPAA/PCI/SOC2 bulk is off-stack) |

## B · Surface-gated — activate when a reserved surface lands

Referenced by a **stack-option** (registry PLAN/BUILD/TEST), so these live in their **topic
folder** (outside bench), ready when the surface appears.

| Reserved surface | Agents | Role |
| --- | --- | --- |
| `apps/api` | `api-designer` (03) · `backend-developer` (04) · `api-tester` (06) | contract → implementation → API tests; `api-designer` front-runs the wired `backend-architect` |
| `code/db` | `database-schema-designer` (03/04) | schema + migrations + indexing (wired `data-architect` plans the model) |
| a CLI | `cli-developer` | arg parsing, terminal UX, completions |
| an MCP server | `mcp-developer` | JSON-RPC servers/clients, tools/resources |
| a mobile app | `mobile-developer` | React Native/Flutter (redundant twin `mobile-app-builder` stays in bench) |
| GraphQL | `graphql-architect` | schema / federation / subscriptions (Sanity is GROQ-first) |
| realtime | `websocket-engineer` | WebSocket / pub-sub messaging |

## C · Growth / GTM — the project lane's go-to-market stages

The **project lane** (run once per product, not part of the core build sprint). Maps to
[`launch-playbook.md`](./launch-playbook) stages + the [Project-lane registry](./my-skills-and-agents.md#project-lane-per-project-stages-run-once).
Agents live in the **`marketing/`** topic folder (outside bench — it *is* the growth/GTM lane).

| Agent | Stage | Role |
| --- | --- | --- |
| `growth-hacker` | 6/12 | **anchor** — acquisition / activation / retention experiments (AARRR), ICE-prioritized |
| `instagram-curator` · `reddit-community-builder` · `tiktok-strategist` · `twitter-engager` | 6 | channel execution — fire per chosen channel |
| `project-shipper` | 11 | launch orchestration — release calendar, go-to-market coordination |
| `uat-coordinator` | 11 | go-live sign-off — business-user acceptance before launch |
| `experiment-tracker` | 12 | post-launch A/B + feature-flag experiment tracking |

**Still benched (gate before wiring):** `content-creator` (redundant with `marketing:content-creation`
+ `copy-reviewer` — reach for the skill first) · `app-store-optimizer` (no app/store surface) ·
`studio-producer` (team/multi-project orchestration — solo workflow doesn't need it).

## D · Skip — stay benched, don't reach for

**Redundant with a wired agent:** `architecture-consultant` (≡ `system-architect`) ·
`performance-optimizer` (↔ wired `performance-benchmarker`) · `tech-writer` (↔ `documentation-engineer`) ·
`git-workflow-manager` (↔ `git-manager`) · `content-creator` (↔ the `marketing:content-creation`
skill + wired `copy-reviewer`) · `project-template-manager` + `agent-coordinator` (↔ the explicit
phase batches — a parallel router just muddies them).

**Off-stack for a Next.js + Sanity marketing/blog template:** `ai-engineer` · `electron-pro` ·
`microservices-architect` · `wordpress-master` · `app-store-optimizer` (no app/store) ·
`studio-producer` + `training-change-manager` (team/org orchestration — this is a solo workflow) ·
`chaos-engineer` (no distributed infra).
