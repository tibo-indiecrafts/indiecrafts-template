# `@indiecrafts/packages-shared-compliance` — portable consent core

Auto-loads under `code/packages/shared/compliance/**`. The portable half of the compliance surface:
the consent decision math, the store + legal-route contracts, and a copy-injected consent +
legal-reacceptance UI. Serves the `app` web surface (also inside the Capacitor shell) and
the api Worker (the erasure/export core) — **no `next`/Sanity**. Area rules → `../../../.claude/CLAUDE.md`.

**Stack:** TypeScript + React 19 — `./web` shadcn UI; no next/Sanity.

- **Exports:** `./shared` (consent math + `LEGAL_PAGES`/`legalUrl`/`needsReacceptance` + the **geo→regulation** resolver `resolveRegulation`/`resolveConsentMode` over `REGULATIONS`·`CONSENT_REGIONS`·`TERRITORIES`·`ConsentConfig`, no React) · `./web` (shadcn UI + `localStorage` store + `browserSignalsDeny` GPC, plus the account bodies `AccountConsentTab`/`AccountDataTab`, `DeleteAccountSection` + its extracted `ChurnSurvey`, `ExportSection`, and the **marketing-email consent** pair — `MarketingEmailToggle` (the account-settings opt-in, reads/writes `/v1/consent/marketing-email`) and `MarketingNudge` (the one-time sign-in prompt, transport-agnostic via injected `read`/`write`).
- **Copy + `categories` are injected** — no i18n/Sanity inside; each surface passes its own strings and wires a `Store` adapter.
- **The website keeps its richer `packages-web-compliance`** (Sanity/next-intl) over the **same** math — this brick is the one source of the decision logic.
- **`LegalReacceptancePrompt` is the one legal banner** — the website's `LegalNotice` renders it too (with its locale `Link`). Its Tailwind classes reach every surface via the `@source` line in `web/ui-tokens/globals.css`.

Full reference → [`code/docs/packages/compliance-shared.md`](../../../../docs/packages/compliance-shared.md).
