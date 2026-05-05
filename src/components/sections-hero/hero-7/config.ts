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
export const hero7Key = "hero-7" as const;
export const hero7Namespace = "blocks.hero-7" as const;

/** Primary CTA target. */
export const hero7PrimaryCtaHref = "#" as const;
/** Secondary CTA target. */
export const hero7SecondaryCtaHref = "#" as const;
