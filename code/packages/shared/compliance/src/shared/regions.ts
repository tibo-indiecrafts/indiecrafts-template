/**
 * Geo → regulation → consent-mode resolution. The visitor's country (ISO-3166-1 alpha-2, as
 * `cf-ipcountry` returns it) maps to a NAMED privacy regulation (GDPR, UK GDPR, CCPA, …); each
 * regulation carries the consent UI `mode` it implies. Pure + framework-agnostic (the `/shared`
 * layer): the website, the web/native shells, AND the api Worker (`GET /v1/geo`) all resolve
 * from this ONE map. GDPR/UK GDPR/CCPA plus LGPD (Brazil), PIPEDA (Canada), POPIA (South
 * Africa), and Australia's Privacy Act ship built in. Everything stays configurable +
 * extensible: a client can add further named regulations and (re)assign countries/territories,
 * and an assignment on a PARENT country cascades to its external territories.
 * Reference: docs/apps/web/config/cookie-consent-geo.md
 */

/**
 * The consent UI behaviour a regulation implies.
 * - `opt-in`  — GDPR / UK-GDPR / ePrivacy: block non-essential cookies until prior consent.
 * - `opt-out` — CCPA/CPRA-shaped: no blocking banner, but a "privacy choices" affordance + GPC.
 * - `none`    — no consent-banner law; still honour GPC as good practice.
 */
export type ConsentMode = "opt-in" | "opt-out" | "none";

/** A named privacy regulation. `name` is the human/audit label; `mode` is what the banner
 *  acts on. Add your own via config (see `ConsentConfig.regulations`). */
export type Regulation = { name: string; mode: ConsentMode };

/** The built-in regulation catalog, keyed by a short id. Extend/override it per deployment via
 *  `ConsentConfig.regulations` — e.g. add `pipl: { name: "PIPL", mode: "opt-in" }` for China. */
// Mode rationale: LGPD/PIPEDA/POPIA are consent-based regimes → opt-in, like GDPR. Australia's
// Privacy Act (APPs) is notice-based with no cookie-consent-banner requirement → opt-out, like
// CCPA (a "privacy choices" affordance, honours GPC). All four are safe defaults — a deployment
// can still override the mode or the country/territory assignment via `ConsentConfig`.
export const REGULATIONS = {
  gdpr: { name: "GDPR", mode: "opt-in" },
  ukgdpr: { name: "UK GDPR", mode: "opt-in" },
  ccpa: { name: "CCPA/CPRA", mode: "opt-out" },
  lgpd: { name: "LGPD", mode: "opt-in" },
  pipeda: { name: "PIPEDA", mode: "opt-in" },
  popia: { name: "POPIA", mode: "opt-in" },
  privacyact: { name: "Australia Privacy Act", mode: "opt-out" },
  none: { name: "None", mode: "none" },
} as const satisfies Record<string, Regulation>;

// Sovereign states by regulation (their territories are handled below).
const GDPR = [
  // EU-27
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  // EEA (non-EU)
  "IS",
  "LI",
  "NO",
];
const UK_GDPR = ["GB"];
// Country-level only — `cf-ipcountry` can't see US states, so the whole US is CCPA/opt-out
// (a safe superset of California/CPRA). State refinement via `request.cf.region` is a follow-up.
const CCPA = ["US"];
const LGPD = ["BR"];
const PIPEDA = ["CA"];
const POPIA = ["ZA"];
const AUS = ["AU"];

/**
 * Parent country → its external / overseas territories (ISO-3166-1 alpha-2, the codes
 * `cf-ipcountry` returns). Powers the per-territory defaults below AND the config **cascade** —
 * an override on a PARENT (e.g. `{ FR: "gdpr" }`) applies to all its territories, unless a
 * territory carries its own override. (Hong Kong / Macau are omitted on purpose — separate legal
 * systems, so they resolve independently, overridable per code.)
 */
export const TERRITORIES: Record<string, readonly string[]> = {
  // French Republic: 6 EU outermost regions (gdpr) + 6 overseas countries/territories (none).
  FR: ["GF", "GP", "MQ", "YT", "RE", "MF", "BL", "PF", "NC", "PM", "WF", "TF"],
  // UK: GDPR-equivalent (Gibraltar + Crown Dependencies) + other Overseas Territories (none).
  GB: [
    "GI",
    "JE",
    "GG",
    "IM",
    "BM",
    "KY",
    "VG",
    "AI",
    "MS",
    "TC",
    "FK",
    "GS",
    "SH",
    "PN",
    "IO",
  ],
  US: ["PR", "GU", "VI", "AS", "MP", "UM"],
  NL: ["AW", "CW", "SX", "BQ"],
  DK: ["GL", "FO"],
  NO: ["SJ", "BV"],
  FI: ["AX"],
  NZ: ["CK", "NU", "TK"],
  AU: ["NF", "CX", "CC", "HM"],
};

// Territories whose regulation differs from a plain fallthrough. Those legally INSIDE a GDPR
// jurisdiction — the EU outermost regions + Åland + the UK's GDPR-equivalent Gibraltar & Crown
// Dependencies — carry it; US territories inherit CCPA; Australia's inhabited external
// territories (Norfolk Island, Christmas Island, Cocos (Keeling) Islands — `HM` is uninhabited,
// skipped) inherit its Privacy Act. Every OTHER territory defaults to `none`.
const TERRITORY_REGULATION: Record<string, string> = {
  GF: "gdpr",
  GP: "gdpr",
  MQ: "gdpr",
  YT: "gdpr",
  RE: "gdpr",
  MF: "gdpr",
  AX: "gdpr",
  GI: "ukgdpr",
  JE: "ukgdpr",
  GG: "ukgdpr",
  IM: "ukgdpr",
  PR: "ccpa",
  GU: "ccpa",
  VI: "ccpa",
  AS: "ccpa",
  MP: "ccpa",
  UM: "ccpa",
  NF: "privacyact",
  CX: "privacyact",
  CC: "privacyact",
};

/** The default country/territory → regulation-key map. Anything NOT listed resolves to `none`. */
export const CONSENT_REGIONS: Record<string, string> = {
  ...Object.fromEntries(GDPR.map((c) => [c, "gdpr"])),
  ...Object.fromEntries(UK_GDPR.map((c) => [c, "ukgdpr"])),
  ...Object.fromEntries(CCPA.map((c) => [c, "ccpa"])),
  ...Object.fromEntries(LGPD.map((c) => [c, "lgpd"])),
  ...Object.fromEntries(PIPEDA.map((c) => [c, "pipeda"])),
  ...Object.fromEntries(POPIA.map((c) => [c, "popia"])),
  ...Object.fromEntries(AUS.map((c) => [c, "privacyact"])),
  ...TERRITORY_REGULATION,
};

/** Territory code → its parent country, for the config cascade. */
const PARENT_OF: Record<string, string> = Object.fromEntries(
  Object.entries(TERRITORIES).flatMap(([parent, terrs]) =>
    terrs.map((code) => [code, parent]),
  ),
);

/**
 * Per-deployment consent config (from each surface's `@/config`). Flexible + extensible:
 *  - `regulations` — add or override named regulations (merged over the built-in `REGULATIONS`).
 *  - `overrides`   — assign a regulation KEY to a country/territory (uppercase alpha-2). An
 *                    assignment on a parent country cascades to its territories.
 * e.g. `{ regulations: { pipl: { name: "PIPL", mode: "opt-in" } }, overrides: { CN: "pipl", CH: "gdpr" } }`
 */
export type ConsentConfig = {
  regulations?: Record<string, Regulation>;
  overrides?: Record<string, string>;
};

/** The regulation KEY for a visitor. Precedence: exact override → PARENT override (cascade) →
 *  default map → `none`. Unknown geo (missing / CF `XX`/`T1`/`T2`) fails **safe** to `gdpr`. */
function regionKey(
  country: string | null | undefined,
  overrides?: Record<string, string>,
): string {
  if (!country) return "gdpr";
  const code = country.toUpperCase();
  if (code === "XX" || code === "T1" || code === "T2") return "gdpr";
  const parent = PARENT_OF[code];
  return (
    overrides?.[code] ??
    (parent ? overrides?.[parent] : undefined) ??
    CONSENT_REGIONS[code] ??
    "none"
  );
}

/**
 * Resolve the applicable named regulation (name + mode) for a visitor country/territory. The
 * catalog is the built-in `REGULATIONS` merged with any `config.regulations`. An override key
 * with no matching regulation degrades to `{ name: key, mode: "none" }` (visible misconfig, not
 * a crash).
 */
export function resolveRegulation(
  country: string | null | undefined,
  config?: ConsentConfig,
): Regulation {
  const catalog: Record<string, Regulation> = {
    ...REGULATIONS,
    ...config?.regulations,
  };
  const key = regionKey(country, config?.overrides);
  return catalog[key] ?? { name: key, mode: "none" };
}

/** The consent MODE the banner acts on — `resolveRegulation(...).mode`. */
export function resolveConsentMode(
  country: string | null | undefined,
  config?: ConsentConfig,
): ConsentMode {
  return resolveRegulation(country, config).mode;
}
