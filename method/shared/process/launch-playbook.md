# Launch playbook — the project lane, stage by stage

The **project lane** of [`end-to-end.md`](./end-to-end) — idea → launched product, run **once per
product**. Where the [feature lane](./workflow) is the 7-phase build sprint (run per branch), this
is the go-to-market spine around it. Every stage below names its **tasks** + its **tools** (gstack ·
skills · agents · MCP), mirroring the per-phase [registry](./my-skills-and-agents). Track a product
through it in the **`PROJECTS`** Reminders list (one reminder per product, these stages as its
checklist).

> **Two lanes, one flow.** Stages 1–9 set the product up; stage 10 hands off to the feature lane
> (N sprints); stages 11–13 launch and grow. Business (3–6) precedes build (10); measurement (12)
> feeds the next features and re-opens the model.

## 1 · Idea / reframe

Frame the product idea — the problem, the who, the wedge.

- **gstack:** `/office-hours` · **Skills:** `brainstorming` · `deep-research` · `storm` → `by-skill/research/`

## 2 · Discovery

Understand the user and the problem before betting on a solution.

- **Skills:** `pm-product-discovery:*` · `layers-orient`

## 3 · Validate market

Pick and pressure-test the niche; know the competition and the value.

- **Tasks:** niche brainstorm → evaluation → selection · understand success rates · market /
  competitive analysis · core value proposition / USP.
- **Skills:** `pm-market-research:*` (sizing · ICP · competitor) · `firecrawl-*` ·
  **MCP:** `ahrefs` (keywords / SEO gaps) · `similarweb` (competitor traffic).

## 4 · Business model

Decide how the product makes money.

- **Tasks:** business model.
- **Skills:** `pm-product-strategy:business-model` · `lean-canvas` · `value-proposition` →
  `00_BRIEF/BUSINESS.md`.

## 5 · Pricing

Set price and tiers against unit economics.

- **Tasks:** pricing · business-tier development.
- **Skills:** `pm-product-strategy:pricing` · `data:*` → `00_BRIEF/UNIT-ECONOMICS.md`.

## 6 · GTM plan

Build the audience and the channels **before** launch — the bulk of the old LAUNCH LIST.

- **Tasks:** build an audience · build an email list · waitlist / pre-sales · outreach list (warm
  it up) · landing page with email capture · set up socials (and post) · link from your own socials ·
  hang out where the market is · community / launch-platform participation · collect social proof ·
  pre-launch SEO · SEO landing pages · video marketing · explainer video · partnerships · press
  release · pre-launch email marketing · blogging / podcasting.
- **gstack:** `marketing:campaign-plan` · **Skills:** `pm-go-to-market:*` (gtm-strategy · plan-launch ·
  ICP · beachhead · growth-loops · battlecard) · `pm-marketing-growth:*` ·
  `marketing:{content-creation,email-sequence,seo-audit}` · `avoid-ai-writing` ·
  **Agents:** `growth-hacker` (anchor — AARRR) + channels (`instagram-curator` · `reddit-community-builder` ·
  `tiktok-strategist` · `twitter-engager`) · **MCP:** `hubspot` (CRM) · `klaviyo` (email) ·
  `notion` (content ops) · `canva` / `figma` (creative) · `koboyo` (pitch / explainer slide deck) ·
  `slack` (community) · `apollo` / `clay` / `zoominfo` (outreach lists).

## 7 · Legal

Protect the brand and satisfy the rules.

- **Tasks:** INPI / copyright · terms + privacy · NDA where needed.
- **Skills:** `legal:review-contract` · `triage-nda` · `compliance-check` ·
  **MCP:** `docusign` (signatures) · `atlassian` (legal ops).

## 8 · Design system

Set the brand, tokens, and type once — every feature inherits it.

- **gstack:** `/design-consultation` · **Skills:** `ui-ux-pro-max` → `DESIGN.md` · `frontend-design` ·
  **MCP:** `figma` · `canva` · `koboyo` (wireframes on an editable canvas · 70k-icon set).

## 9 · Deploy pipeline

Stand up domain, hosting, SEO/OG, and continuous deploy.

- **Tasks:** domain name + web hosting · SEO/OG setup (2 langs) · sticky notes / infra bits.
- **gstack:** `/setup-deploy` · **Skills:** netlify skills.

## 10 · Build features → the feature lane

Each capability is one branch through the 7-phase sprint
(`02 THINK` → `08 REFLECT`, see [`workflow.md`](./workflow)). Inherits the business model, design
system, and pipeline above. Track them in the **`FEATURES`** Reminders list.

- **Tasks (as features):** sales-website sitemap · copywriting · payment integration · product
  delivery · support + feedback features.

## 11 · Launch

Ship it to the audience you built.

- **Tasks:** stress-test product + site · notify email list / waitlisters · prepare launch outreach /
  posts / promotion · launch on platforms / communities / directories · reach out to email +
  outreach lists · market / promote / advertise · follow up on no-response outreach.
- **gstack:** `/land-and-deploy` · `/canary` · **Skills:** `marketing:plan-launch` ·
  **Agents:** `project-shipper` (launch orchestration) · `uat-coordinator` (go-live sign-off) ·
  **MCP:** `koboyo` (launch-day slide deck).

## 12 · Grow / measure

Learn from real users; feed the next features.

- **Tasks:** conduct a beta · fix post-launch bugs · prioritize customer feedback · gather + analyze
  user feedback.
- **Skills:** `data:*` (cohorts · A/B · dashboards) · `pm-data-analytics:*` ·
  `marketing:performance-report` · **Agents:** `experiment-tracker` · **MCP:** `amplitude` / `pendo`
  (product analytics) · `supermetrics` (marketing data) · `bigquery` / `hex`.

## 13 · Reflect / iterate

Close the loop; the retro feeds the next cycle.

- **gstack:** `/retro global` · `/learn` · **Agents:** `progress-tracker`.

---

**Sales (optional — outbound motions):** across stages 6/11, add `sales:*` +
**MCP** `apollo` · `close` · `outreach` · `fireflies`.

**The loop.** The project lane runs once (revisit at `/retro`). The feature lane (stage 10) runs N
times. Nothing is skipped: each stage names its tool and — via `PROJECTS` / `FEATURES` — its tracker.
Full tool map → [`my-skills-and-agents.md`](./my-skills-and-agents); MCP setup →
[`mcp-servers.md` § go-to-market](../tooling/mcp-servers#optional-go-to-market-mcps-opt-in-plugin-servers-not-committed).
