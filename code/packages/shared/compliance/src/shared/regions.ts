/**
 * Geo → regulation → consent-mode RESOLUTION. The visitor's country (ISO-3166-1 alpha-2, as
 * `cf-ipcountry` returns it) maps to a NAMED privacy regulation (GDPR, UK GDPR, CCPA, …); each
 * regulation carries the consent UI `mode` it implies. Pure + framework-agnostic (the `/shared`
 * layer): every web surface resolves the mode server-side from its own `cf-ipcountry` header,
 * all from this ONE algorithm. The data tables it reads (regulations + country/territory maps) live
 * in `./regions.data`; a client edits those. GDPR/UK GDPR/CCPA plus LGPD/PIPEDA/POPIA and
 * Australia's Privacy Act ship built in, and an assignment on a PARENT country cascades to its
 * external territories.
 * Reference: docs/projects/web/website/config/cookie-consent-geo.md
 */
import {
  CONSENT_REGIONS,
  PARENT_OF,
  REGULATIONS,
  type ConsentMode,
  type Regulation,
} from "./regions.data";

// Re-export the data catalog + its types so `./regions` stays the single public surface
// (the `shared/index.ts` barrel + every consumer import from here, unchanged by the split).
export {
  CONSENT_REGIONS,
  REGULATIONS,
  TERRITORIES,
  type ConsentMode,
  type Regulation,
} from "./regions.data";

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
