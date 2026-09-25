/**
 * Configure the geo cookie-consent regulations for this deployment.
 *
 * @see docs/reference/projects/web/website/src/config/consent.md
 */
import type { ConsentConfig } from "@indiecrafts/packages-shared-compliance/shared";

/**
 * Consent geo config for this deployment — flexible + regulation-named.
 *  - `regulations` — add or override NAMED regulations (merged over the built-ins GDPR / UK
 *    GDPR / CCPA / None), e.g. `lgpd: { name: "LGPD", mode: "opt-in" }`.
 *  - `overrides`   — assign a regulation key to a country/territory (uppercase ISO-3166-1
 *    alpha-2). An assignment on a PARENT country cascades to its external territories.
 *
 * The built-in map already covers EU/EEA + UK + their in-scope territories (GDPR/UK GDPR →
 * opt-in), the US + its territories (CCPA → opt-out), and everything else (none). Empty = defaults.
 *
 * e.g. `{ regulations: { lgpd: { name: "LGPD", mode: "opt-in" } }, overrides: { BR: "lgpd", CH: "gdpr" } }`
 */
export const consent: ConsentConfig = {
  overrides: {},
};
