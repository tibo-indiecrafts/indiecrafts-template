---
title: "Cookie consent — geo-targeted regulations"
description: "The consent banner is geo-targeted: the visitor's country maps to a named privacy regulation (GDPR, UK GDPR, CCPA…), and each regulation carries the consent-…"
status: stable
---

# Cookie consent — geo-targeted regulations

The consent banner is **geo-targeted**: the visitor's country maps to a **named privacy
regulation** (GDPR, UK GDPR, CCPA…), and each regulation carries the consent-UI **mode** it
implies. So an EU-style opt-in banner never shows to visitors who don't legally need it — while
the US opt-out obligation is still met. Everything is **configurable + extensible** (add your own
regulations, reassign any country/territory), on **all three surfaces** (website · app · mobile).

## Regulations → modes

The built-in catalog (`REGULATIONS` in
[`packages/shared/compliance/src/shared/regions.ts`](/packages/shared/compliance)); a
client adds/overrides entries via config.

| Key          | Name                  | Mode      | Behaviour                                                                                                                                                          |
| ------------ | --------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `gdpr`       | GDPR                  | `opt-in`  | Blocking banner; non-essential denied until consent; honours GPC.                                                                                                  |
| `ukgdpr`     | UK GDPR               | `opt-in`  | Same as GDPR (UK/ePrivacy).                                                                                                                                        |
| `ccpa`       | CCPA/CPRA             | `opt-out` | **No** blocking banner; default accept, but a "manage preferences" affordance + **GPC honoured**.                                                                  |
| `lgpd`       | LGPD                  | `opt-in`  | Brazil. Consent-based, like GDPR — blocking banner until consent.                                                                                                  |
| `pipeda`     | PIPEDA                | `opt-in`  | Canada. Consent-based — blocking banner until consent.                                                                                                             |
| `popia`      | POPIA                 | `opt-in`  | South Africa. Consent-based — blocking banner until consent.                                                                                                       |
| `privacyact` | Australia Privacy Act | `opt-out` | Australia. The APPs are notice-based with no cookie-consent-banner requirement — no blocking banner, but a "privacy choices" affordance + GPC honoured, like CCPA. |
| `none`       | None                  | `none`    | No banner; default accept; still honours GPC.                                                                                                                      |

LGPD, PIPEDA, POPIA, and Australia's Privacy Act ship **built in** alongside GDPR/UK GDPR/CCPA —
no config needed to enable them. They are safe defaults; a deployment can still override the mode
or reassign the country via `ConsentConfig`.

## Country / territory → regulation (the default map)

`CONSENT_REGIONS` maps ISO-3166-1 alpha-2 codes (what `cf-ipcountry` returns) to a regulation key.

- **`gdpr`** — EU-27 · EEA (`IS LI NO`) · the EU **outermost regions** with their own codes
  (`GF GP MQ YT RE MF`) + Åland (`AX`).
- **`ukgdpr`** — `GB` + Gibraltar (`GI`) + the Crown Dependencies (`JE GG IM`).
- **`ccpa`** — `US` + its territories (`PR GU VI AS MP UM`). _(Country-level only: `cf-ipcountry`
  can't see US states, so the whole US is CCPA — a safe superset of California. State refinement
  via `request.cf.region` is a follow-up.)_
- **`lgpd`** — `BR` (Brazil).
- **`pipeda`** — `CA` (Canada).
- **`popia`** — `ZA` (South Africa).
- **`privacyact`** — `AU` (Australia) + its inhabited external territories (`NF CX CC`).
- **`none`** — everything else, including the EU **OCTs** (Greenland `GL`, French Polynesia `PF`,
  New Caledonia `NC`, Saint-Barthélemy `BL`, the Dutch Caribbean, …) which are _associated with_,
  not part of, the EU, plus states with their own regimes (`CH` …).
- **Unknown geo** (missing, or Cloudflare's `XX`/`T1`/`T2` sentinels) → fails safe to **`gdpr`** (opt-in).

### External territories

`TERRITORIES` maps a parent country to its overseas territories (`FR GB US NL DK NO FI NZ AU`).
Each territory carries its own legally-correct default (EU outermost regions + UK GDPR-equivalent →
opt-in; US territories → CCPA; Australia's inhabited territories → its Privacy Act; the rest →
none), **and** a parent assignment **cascades** to its territories.

## Config — flexible, named, per country + territories

Each surface exposes a `consent: ConsentConfig` in its `@/config`:

```ts
export const consent = {
  // 1. Add or override NAMED regulations not already built in (merged over the built-ins):
  regulations: {
    pipl: { name: "PIPL", mode: "opt-in" },
  },
  // 2. Assign a regulation key to a country/territory (uppercase alpha-2).
  //    A parent-country assignment cascades to its territories; a territory entry wins over it.
  overrides: {
    CN: "pipl", // China → your custom PIPL regulation
    CH: "gdpr", // Switzerland → treat as GDPR
    FR: "gdpr", // …also covers GF, GP, PF, NC, … (all French territories)
    GP: "none", // …except Guadeloupe, pinned individually
  },
};
```

`features.requireConsent` (app/mobile) / `siteSettings.analytics.requireCookieConsent`
(website) stays the **master off-switch** — off ⇒ no consent UI anywhere, geo ignored. **Exception
(website only):** a CCPA/opt-out visitor still gets a working preferences dialog behind the footer
"Do Not Sell" link even with the switch off — see the next section.

## "Do Not Sell or Share" (CCPA/CPRA) footer link — website

In `opt-out` mode there is no blocking banner, so a US/CCPA visitor's only visible
control is the footer link. The website renders a **"Do Not Sell or Share My
Personal Information"** link in its footer, shown ONLY when the resolved consent
mode is `opt-out` — resolved server-side (`resolveConsentMode(cf-ipcountry, consent)`
in `DefaultLayout.tsx`, the same way `[locale]/layout.tsx` gates the banner) and
passed down as a plain boolean prop, so there's no client-side flash for EU/other
visitors.

- `DoNotSellLink` (`code/packages/web/compliance/src/consent/DoNotSellLink.tsx`) —
  a client component that calls the **same** `openPreferences()` used by
  `ManagePreferencesButton`, opening the existing cookie-preferences dialog (no new
  consent UI). It renders `null` unless its `show` prop is `true`.
- Mounted from `Footer.tsx`, which receives `showDoNotSell` from `DefaultLayout.tsx`.
- Copy: `cookies.doNotSell.link` in `messages/<locale>.json`.
- **The dialog it opens must actually be mounted.** `<CookiePreferences>` (the dialog)
  and its `OPEN_PREFERENCES_EVENT` listener normally live inside `CookieBanner`, which
  `[locale]/layout.tsx` mounts only when `requireCookieConsent` is on. Since the
  Do-Not-Sell link can show with that switch off (it only checks `consentMode`),
  `[locale]/layout.tsx` also mounts a standalone `CookiePreferencesHost` — the same
  dialog + listener, no banner — whenever `requireCookieConsent` is off **and**
  `consentMode === "opt-out"`, so the link always opens a working dialog.

## The country signal per surface

- **website · app** (next-cf) — read `cf-ipcountry` **server-side** in the `[locale]/layout`,
  resolve, and pass the `mode` to the banner. (These layouts are already dynamic.)
- **mobile** (native) — no CF headers, so it fetches the api **`GET /v1/geo`** once on
  launch (`lib/geo.ts`), which echoes the device's edge `cf-ipcountry` (+ the
  default `regulation` + `mode`). The country is cached (AsyncStorage) and the mode
  re-resolved locally with the app's config; unreachable + nothing cached → fails safe to opt-in.
  The banner stays hidden until geo resolves, so it never flashes.

GPC / Do-Not-Track is honoured on every web surface (`browserSignalsDeny`); React Native has no GPC signal.

## Verify

- `pnpm --filter @indiecrafts/packages-shared-compliance test` — the resolver (regulations,
  territories, cascade, custom regulation, CF sentinels).
- `wrangler dev` the api → `curl -H "cf-ipcountry: FR" …/v1/geo` → `{"regulation":"GDPR","mode":"opt-in"}`;
  `US` → `CCPA/CPRA` / `opt-out`; `JP` → `None` / `none`.
