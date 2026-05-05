/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Logo cloud composing a left copy block (headline + "case studies"
 * link) with a right grid of brand SVGs. All visible strings translate
 * via `./en.json`; brand SVGs come from `ui-primitives/svgs`.
 */
export const logoCloud2Key = "logo-cloud-2" as const;
export const logoCloud2Namespace = "blocks.logo-cloud-2" as const;

/** "Case studies" link target. */
export const logoCloud2CaseStudiesHref = "#" as const;
