# Lead generation — the engine, stage by stage

Lead-gen was **diffused** across project-lane stages 6 (GTM), 11 (Launch), and 12 (Grow)
as loose tasks. This doc makes it **one repeatable loop** those stages point to. It reuses
tools already installed — no new plugins.

Two motions, one loop. **Inbound** = the product captures leads that come to you.
**Outbound** = you go find and contact them. Run both; lead with inbound — the capture
bricks already ship in this template.

## The loop

```
source → enrich → capture (inbound) / outreach (outbound) → nurture → qualify → hand-off → measure ↺
```

| Step | Inbound tools | Outbound tools |
| --- | --- | --- |
| **Source** | SEO + content (`marketing:seo-audit`·`content-creation`), lead magnet | `firecrawl-*` (scrape·crawl·map·search) · MCP `apollo`·`clay`·`zoominfo` |
| **Enrich / dedupe** | — | `clay` · `apollo` |
| **Capture / reach** | `modules/waitlist` · `modules/newsletter` + landing page | `sales:draft-outreach` · `pm-go-to-market:*` · MCP `close`·`outreach` |
| **Nurture** | `marketing:email-sequence` · MCP `klaviyo` | `marketing:email-sequence` · MCP `klaviyo` |
| **Qualify / CRM** | MCP `hubspot` | MCP `hubspot`·`close` · `sales:pipeline-review`·`forecast` |
| **Measure** | `data:*` · `marketing:performance-report` · MCP `amplitude` | same |
| **Agents** | `growth-hacker` (anchor — AARRR) + channels | `growth-hacker` + `sales:*` |

## Project or feature?

- **Outbound = project lane.** An ops motion, run once and then continuously. It is not a
  code branch. It lives in the project lane at stages 6/11/12, driven by this loop.
- **Inbound = feature lane.** The capture surface is **code** — build it as a sprint
  (`02 THINK` → `08 REFLECT`) that composes the bricks below. See [`workflow.md`](./workflow).

## Inbound — the bricks already ship

The template already has the full inbound capture surface. A lead-capture feature wires
these; it does not build from scratch.

| Brick | Where |
| --- | --- |
| Waitlist feature | `code/modules/waitlist` |
| Newsletter feature | `code/modules/newsletter` |
| **Lead magnet** | `module.lead-magnet` block (capture + gated download) → `leadMagnet` doc in `code/modules/newsletter` |
| Gated delivery | `@indiecrafts/gated-delivery` (signed, expiring `/api/download` link) |
| Capture forms | `LeadMagnetForm.tsx` · `WaitlistForm.tsx` · `NewsletterForm.tsx` (`code/packages/ui-components/src/web/form/`) |
| Spam guard | `TurnstileWidget.tsx` (Cloudflare Turnstile) |
| Lead export | `scripts/waitlist-export.mjs` · `scripts/subscribers-export.mjs` |

**Worked example — a lead magnet (built):** create a `leadMagnet` doc (Studio → Aimants à
prospects: title + file) → drop a `module.lead-magnet` block on a page, referencing it → visitor
submits e-mail (Turnstile-gated) → double opt-in → on confirm, a signed 7-day download link is
e-mailed (`@indiecrafts/gated-delivery`). The lead is a normal `subscriber` tagged
`source: "lead-magnet"` — one list, segmentable. Nurture with `marketing:email-sequence` in
`klaviyo`; export with `subscribers-export.mjs`; push to `hubspot`.

## Outbound — the engine to add per project

Outbound needs live account data, so its MCP connectors are **off by default** — turn one
on when you reach the step ([`../tooling/mcp-servers.md`](../tooling/mcp-servers)).

1. **Source** — scrape ICP lists with `firecrawl-*`; or pull from `apollo` / `zoominfo`.
2. **Enrich** — `clay` fills the gaps and dedupes.
3. **Outreach** — draft with `sales:draft-outreach`, sequence in `close` / `outreach`.
4. **Qualify** — `sales:pipeline-review` + `sales:forecast` against the `hubspot` / `close` CRM.
5. **Measure** — `marketing:performance-report` + `data:*`; feed wins back to the ICP.

## Where it plugs into the project lane

- **Stage 6 GTM** — build the audience: inbound capture live, outbound list sourced + warmed.
- **Stage 11 Launch** — fire both: notify the captured list, run the outreach sequences.
- **Stage 12 Grow** — measure both channels, feed qualified leads to the next features.

Full stage detail → [`launch-playbook.md`](./launch-playbook). Per-tool source tags →
[`my-skills-and-agents.md`](./my-skills-and-agents).
