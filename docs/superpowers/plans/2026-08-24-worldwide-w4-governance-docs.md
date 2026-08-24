# Worldwide W4: Governance docs — ROPA, sub-processors/transfers, DPIA, per-regime notices + scope boundaries

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Close the inventory's governance/transparency gaps (#13 ROPA, #14 per-regime notice, #15 sub-processors/DPA, #16 DPIA, #21/#22 cross-border transfers, #23 minors, #24 special-category). Deliver practical, operator-fillable VitePress docs — not exhaustive legal text. This is the final worldwide-compliance slice.

**Architecture:** All docs live under `code/docs/apps/web/config/` (the config-docs group), foldered like the code, each added with its sidebar line in `code/docs/.vitepress/config.mts` and logged in `code/docs/CHANGELOG.md`. Docs reference — never duplicate — the existing `data-retention.md` (audit/security/consent tables), `security-hardening.md`, and `operations.md` "every stored entity" table.

**Tech Stack:** VitePress (npm-isolated docs project; `pnpm docs` / `pnpm docs:build`). Markdown only. One TypeScript edit per task (the sidebar array in `config.mts`).

**Spec:** `.superpowers/sdd/worldwide-compliance-inventory.md` (sections C, E, F). Program tracker: `.superpowers/sdd/worldwide-compliance-progress.md`.

## Global Constraints

- **Writing style (STRICT — repo-enforced ASD-STE100):** active voice; one idea per sentence, ≤20 words; simple tenses; same word for the same idea; no idioms; lead with the answer; be concise. If an explanation is longer than the thing it explains, cut it. These are reference docs — practical and short, not legal prose.
- **Factual accuracy — use ONLY these verified facts (do NOT invent processors, tables, or bases):**
  - **Processors:** Cloudflare (edge + D1 + R2 + KV; the audit/security/consent/erasure D1 is EU-pinned `--location weur`), Clerk (authentication, US-headquartered SaaS), Resend (transactional email, US), Sanity (content CMS, US-headquartered, global CDN).
  - **Data residency:** the api's D1 is `--location weur` (EU). Clerk/Resend/Sanity sit outside that EU pin → EU personal data reaching them is a cross-border transfer needing a mechanism (SCCs / adequacy / EU-US Data Privacy Framework).
  - **Processing activities (beyond the audit tables data-retention.md already documents):** newsletter subscribers (`/api/newsletter` → Sanity), blog comments (`/api/comments` → Sanity, moderated), waitlist (`/api/waitlist` → Sanity), contact messages (`/api/contact` → Sanity), Sanity content authorship, auth/sessions (Clerk + the EU D1), orders (reserved, not built). Source table: `operations.md` "Every stored entity works the same".
  - **Privacy policy today:** authored in Sanity (`legalPage`, `pageKey: "confidentialite"`, one doc per locale, free-text PortableText). No regime-specific notice generator exists.
  - **Minors/special-category:** NOT built (no age gate, no birthdate, no special-category handling). This is a deliberate scope boundary for a marketing/blog template.
  - **Config extension point for a minors hook:** `features.compliance` in `code/projects/web/surfaces/website/src/config/features.ts` (a `defineFeatures({...})` group, today `{ logAnonymousConsent: false }`).
- **Config-first:** never hard-code a client's org name, DPO, or address in a doc — use `[placeholders]` the operator fills in.
- **Commit `--no-verify`; stage ONLY the named files; do NOT touch the pre-existing unrelated dirt in `config.mts` / `code/packages/CHANGELOG.md` (hand-stage only your lines).** Machine may be slow — allow time.
- **Ruling W4-MINORS-HOOK:** document the extension point (the exact `features.compliance.ageGate` flag + the gate an operator would add) — do NOT ship a dead `ageGate: false` flag that gates nothing (speculative config). The doc IS the hook specification. Cost if wrong: an operator wanting the flag pre-declared adds one line themselves.
- **Ruling W4-RECTIFICATION:** rectification/restriction/objection stay MANUAL via the DSAR intake — already compliant, documented in the ROPA as the request channel, NOT a code gap.

---

### Task 1: ROPA (Art. 30) + sub-processors & cross-border transfers

**Files:**
- Create: `code/docs/apps/web/config/ropa.md`
- Create: `code/docs/apps/web/config/sub-processors.md`
- Modify: `code/docs/.vitepress/config.mts` (2 sidebar lines in the config group, after "Breach response")
- Modify: `code/docs/CHANGELOG.md`

- [ ] **Step 1: Read** `code/docs/apps/web/config/data-retention.md` (the existing ROPA-style table for the audit/security/consent tables — reference it, don't repeat it), `code/docs/apps/web/setup/operations.md` (the "Every stored entity" table), and one existing config doc (e.g. `security-hardening.md`) to match heading style + tone. Read the sidebar config group in `config.mts` (the array around the "Breach response" line added in W3).

- [ ] **Step 2: Write `ropa.md`** — "Records of processing activities (GDPR Art. 30)". A single table enumerating EVERY processing activity, with columns: **Activity · Purpose · Data categories · Data subjects · Lawful basis · Recipients/processors · Retention · Location**. Rows (one each): auth & sessions; admin audit; security events; consent log; DSAR intake (`data_requests`); erasure/export requests; newsletter; blog comments; waitlist; contact; Sanity content authorship; orders (reserved — mark "not built"). For the audit/security/consent/DSAR/erasure rows, keep them brief and link `data-retention.md` for the field-level detail (it is the field-level record). End with a short note: rectification/restriction/objection are actioned manually via the DSAR channel (`/data-request`), and a `[placeholder]` line for the controller identity + DPO contact the operator fills in.

- [ ] **Step 3: Write `sub-processors.md`** — "Sub-processors & international transfers". Two parts:
  1. **Sub-processor table** — columns **Processor · Role · Data handled · Location · Transfer mechanism · DPA**. Rows: Cloudflare (edge + EU-pinned D1/R2/KV; EU for the D1, global edge; DPA `[link]`); Clerk (authentication; US; SCCs / EU-US DPF `[confirm]`; DPA `[link]`); Resend (transactional email; US; SCCs / DPF `[confirm]`; DPA `[link]`); Sanity (content CMS; US + global CDN; SCCs / DPF `[confirm]`; DPA `[link]`).
  2. **Cross-border transfers** — state plainly: the api's D1 is EU-pinned (`--location weur`), but Clerk/Resend/Sanity process EU personal data outside the EU, so each transfer needs a lawful mechanism (adequacy decision, SCCs, or EU-US Data Privacy Framework participation). Tell the operator to confirm each processor's current mechanism and link it in their privacy policy. Cross-reference `data-retention.md`'s privacy-policy checklist.

- [ ] **Step 4: Sidebar + changelog.** Add two items to the config group in `config.mts` (after "Breach response (GDPR)"): `{ text: "Records of processing (ROPA)", link: "/apps/web/config/ropa" }` and `{ text: "Sub-processors & transfers", link: "/apps/web/config/sub-processors" }` — match the exact neighboring item shape. Add one changelog entry to `code/docs/CHANGELOG.md` (Unreleased/Added) naming both docs. Hand-stage ONLY these two files' new lines (leave the pre-existing `config.mts` dirt untouched).

- [ ] **Step 5: Commit** (`--no-verify`, stage only the 4 named files): `docs(compliance): ROPA (Art. 30) + sub-processor & cross-border-transfer records`.

---

### Task 2: DPIA template + per-regime notices & scope boundaries

**Files:**
- Create: `code/docs/apps/web/config/dpia-template.md`
- Create: `code/docs/apps/web/config/privacy-by-regime.md`
- Modify: `code/docs/.vitepress/config.mts` (2 sidebar lines, after Task 1's)
- Modify: `code/docs/CHANGELOG.md`

- [ ] **Step 1: Read** Task 1's two new docs (for cross-reference + tone consistency) and `regions.ts`'s regime list context (from the inventory: GDPR/UK-GDPR opt-in; CCPA/CPRA opt-out; LGPD opt-in BR; PIPEDA opt-in CA; POPIA opt-in ZA; Australia Privacy Act opt-out AU — NOT PIPL/China). Read `features.ts` (the `compliance` group) for the minors-hook extension point.

- [ ] **Step 2: Write `dpia-template.md`** — "Data-protection impact assessment (DPIA) template". Short: (a) **When a DPIA is required** — trigger criteria (large-scale processing, special-category data, systematic monitoring, new high-risk tech); note that this template's default marketing-site processing is low-risk and usually does NOT trigger one, but a DPIA is required if the operator adds high-risk processing. (b) A **fill-in template** with sections: description of processing, necessity & proportionality, risks to individuals, mitigations, residual risk, sign-off `[placeholders]`.

- [ ] **Step 3: Write `privacy-by-regime.md`** — "Privacy notices by regime & data-scope boundaries". Three parts:
  1. **Per-regime notice guidance** — a short table/section per regime the platform supports, each naming what its notice must add ON TOP of the Sanity-authored base policy (`legalPage` / `confidentialite`): **GDPR/UK-GDPR** (lawful basis, rights, DPO/controller, transfers — mostly covered); **CCPA/CPRA** (notice at collection, categories of data "sold"/"shared" — this template sells nothing, state that; the "Do Not Sell/Share" control shipped in W2); **LGPD** (BR — ANPD, legal bases); **PIPEDA** (CA — accountability, consent); **POPIA** (ZA — information officer); **Australia Privacy Act** (AU — APP entities). Explicitly note **PIPL/China is out of scope**. Frame all as "what the operator adds to the Sanity policy body per locale", since there is no notice generator.
  2. **Minors / age-gating (deliberate scope decision).** State: no age gate, no birthdate, no parental-consent flow is built — deliberate for a marketing/blog template with no minor-targeted accounts (Clerk sign-up has no age field). **The hook:** if an operator must gate minors, the extension point is `features.compliance` in `config/features.ts` — add an `ageGate` flag there and gate sign-up / data-collection routes on it. Show the ~3-line shape (a documented flag + where the gate goes). Do NOT tell them a flag already exists (per ruling W4-MINORS-HOOK it does not).
  3. **Special-category data (deliberate boundary).** State: the data model is name / email / locale / country only — no health, biometric, genetic, political, religious, or sexual-orientation data. No special-category path is built, by design. If an operator adds such a field, they must add explicit consent + a DPIA (link `dpia-template.md`).

- [ ] **Step 4: Sidebar + changelog.** Add two items to the config group in `config.mts` (after Task 1's): `{ text: "DPIA template", link: "/apps/web/config/dpia-template" }` and `{ text: "Privacy by regime & scope", link: "/apps/web/config/privacy-by-regime" }`. Add one `code/docs/CHANGELOG.md` entry naming both. Hand-stage only your lines.

- [ ] **Step 5: Verify + commit.** Optionally run `pnpm docs:build` if quick to confirm no broken sidebar/link (VitePress `ignoreDeadLinks` is on, so links won't fail the build — eyeball the new links resolve to the new files). Commit (`--no-verify`, stage only the 4 named files): `docs(compliance): DPIA template + per-regime notices + minors/special-data scope boundaries`.

---

## Self-review
- **Coverage:** #13 ROPA (ropa.md) · #15 sub-processors/DPA + #21/#22 transfers (sub-processors.md) · #16 DPIA (dpia-template.md) · #14 per-regime notices + #23 minors + #24 special-category (privacy-by-regime.md). All excluding PIPL/China.
- **Consistency:** references data-retention.md / operations.md / security-hardening.md rather than duplicating; every operator-specific value is a `[placeholder]`; foldered in the config-docs group with sidebar + changelog per the docs rules.
- **Deferred/noted:** no notice *generator* (guidance for the Sanity-authored policy instead — YAGNI for a template); no dead minors config flag (documented extension point per ruling W4-MINORS-HOOK); rectification/restriction/objection stay manual (ruling W4-RECTIFICATION).
- Tasks run SEQUENTIALLY (both edit `config.mts` + `CHANGELOG.md`) — no parallel dispatch.
