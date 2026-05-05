/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Hero composes a left-aligned headline + dual CTA + "trusted by"
 * brand logos, with a skewed framed `ProductIllustration` floating to
 * the right on desktop. All visible strings translate via `./en.json`;
 * visual assets are imported from `ui-illustrations` and brand SVGs
 * from `ui-primitives/svgs`.
 */
export const hero5Key = "hero-5" as const;
export const hero5Namespace = "blocks.hero-5" as const;

/** Primary CTA target. */
export const hero5PrimaryCtaHref = "#" as const;
/** Secondary CTA target ("Watch video"). */
export const hero5SecondaryCtaHref = "#" as const;
