# Business — <project>

The business artifacts, per stage. Each line names the skill that produces it;
output → `09_OUTPUTS/research|data`. Run before/alongside the build.

## Stages

- [ ] **Lean canvas** — `pm-product-strategy:lean-canvas` (or `startup-canvas`)
- [ ] **Market sizing** — `pm-market-research:market-sizing` (TAM/SAM/SOM)
- [ ] **ICP + segments** — `pm-market-research:ideal-customer-profile` + `user-segmentation`
- [ ] **Competitor scan** — `pm-market-research:competitor-analysis`, `deep-research`
- [ ] **Business model** — `pm-product-strategy:business-model`
- [ ] **Value proposition** — `pm-product-strategy:value-proposition`
- [ ] **Pricing / monetization** — `pm-product-strategy:pricing-strategy` + `monetization-strategy`
- [ ] **Unit economics** — `00_BRIEF/UNIT-ECONOMICS.md` (CAC/LTV/runway) ← the finance gap
- [ ] **GTM** — `pm-go-to-market:gtm-strategy`, `beachhead-segment`, `growth-loops`
- [ ] **Legal** — `legal:review-contract` / `triage-nda` / `compliance-check`
- [ ] **Risk / strategy stress-test** — `pm-product-strategy:swot` · `porters-five-forces` · `pm-execution:strategy-red-team`

## Rule

Business precedes build. Validate the model cheaply (assumptions → `pm-product-discovery`)
before writing feature code. Revisit at each `/retro`.
