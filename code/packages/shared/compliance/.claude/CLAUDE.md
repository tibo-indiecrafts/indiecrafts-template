# @indiecrafts/packages-shared-compliance — portable consent core

Auto-loads under `code/packages/shared/compliance/**`. The portable half of the compliance surface:
the consent decision math, the store + legal-route contracts, and a copy-injected consent +
legal-reacceptance UI forked per platform. Serves the `app` web surface and
the Expo shell — **no `next`/Sanity**. Area rules → `../../../.claude/CLAUDE.md`.

**Stack:** TypeScript + React 19 — forked UI (`./web` shadcn / `./native` RN); no next/Sanity.

- **Exports:** `./shared` (consent math + `LEGAL_PAGES`/`legalUrl`/`needsReacceptance` + the **geo→regulation** resolver `resolveRegulation`/`resolveConsentMode` over `REGULATIONS`·`CONSENT_REGIONS`·`TERRITORIES`·`ConsentConfig`, no React) · `./web` (shadcn UI + `localStorage` store + `browserSignalsDeny` GPC) · `./native` (RN UI + `AsyncStorage` store). Both `./web` and `./native` ship the account bodies (`AccountConsentTab`/`AccountDataTab`, `DeleteAccountSection`, `ExportSection`) plus the **marketing-email consent** pair — `MarketingEmailToggle` (the account-settings opt-in, reads/writes `/v1/consent/marketing-email`) and `MarketingNudge` (the one-time sign-in prompt; `./web` is transport-agnostic via injected `read`/`write`, `./native` fetches directly).
- **Copy + `categories` are injected** — no i18n/Sanity inside; each shell passes its own strings and wires a `Store` adapter.
- **The website keeps its richer `packages-web-compliance`** (Sanity/next-intl) over the **same** math — this brick is the one source of the decision logic.
- **`@react-native-async-storage/async-storage` is an optional peer** — only `./native` imports it; a web install never bundles it.

Full reference → [`code/docs/packages/compliance-shared.md`](../../../../docs/packages/compliance-shared.md).
