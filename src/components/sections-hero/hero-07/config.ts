/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Hero composes a two-column heading + body block with dual CTAs, a
 * full-width `ProductIllustration` underneath, and a six-logo bordered
 * "trusted by" strip. All visible strings translate via `./en.json`;
 * brand SVGs come from `ui-primitives/svgs`, the dashboard mock from
 * `ui-illustrations`.
 */
export const hero07Key = "hero-07" as const;
export const hero07Namespace = "blocks.hero-07" as const;

/** Primary CTA target. */
export const hero07PrimaryCtaHref = "#" as const;
/** Secondary CTA target. */
export const hero07SecondaryCtaHref = "#" as const;
