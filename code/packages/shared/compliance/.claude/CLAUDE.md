# `@indiecrafts/packages-shared-compliance` — portable consent core

Auto-loads under `code/packages/shared/compliance/**`. The portable half of the compliance surface:
the consent decision math, the store + legal-route contracts, and a copy-injected consent +
legal-reacceptance UI. Serves the `app` web surface (also inside the Capacitor shell) and
the api Worker (the erasure/export core) — **no `next`/Sanity**. Area rules → `../../../.claude/CLAUDE.md`.

**Stack:** TypeScript + React 19 — `./web` shadcn UI; no next/Sanity.

- **Exports:** `./shared` (consent math + `LEGAL_PAGES`/`legalUrl`/`needsReacceptance` + the **geo→regulation** resolver `resolveRegulation`/`resolveConsentMode` over `REGULATIONS`·`CONSENT_REGIONS`·`TERRITORIES`·`ConsentConfig`, no React) · `./web` (shadcn UI + `localStorage` store + `browserSignalsDeny` GPC, plus the account bodies `AccountConsentTab`/`AccountDataTab`, `DeleteAccountSection` + its extracted `ChurnSurvey`, `ExportSection`, and the **marketing-email nudge** `MarketingNudge` (the one-time sign-in prompt, transport-agnostic via injected `read`/`write`), the email preference centre `EmailPreferences` + `emailPreferencesIo` (one switch per category, no all-in-one switch), and the consent proof `reportConsent`) · `./server/consent-log` (`logConsent`, server-only: forwards a decision to the api with `APP_API_TOKEN` — used by each surface's `/api/consent-log`).
- **Copy + `categories` are injected** — no i18n/Sanity inside; each surface passes its own strings and wires a `Store` adapter.
- **The website keeps its richer `packages-web-compliance`** (Sanity/next-intl) over the **same** math — this brick is the one source of the decision logic.
- **`LegalReacceptancePrompt` is the one legal banner** — the website's `LegalNotice` renders it too (with its locale `Link`). Its Tailwind classes reach every surface via the `@source` line in `web/ui-tokens/globals.css`.

Full reference → [`code/docs/packages/shared/compliance.md`](../../../../docs/packages/shared/compliance.md).
