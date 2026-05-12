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
export const hero05Key = "hero-05" as const;
export const hero05Namespace = "blocks.hero-05" as const;

/** Primary CTA target. */
export const hero05PrimaryCtaHref = "#" as const;
/** Secondary CTA target ("Watch video"). */
export const hero05SecondaryCtaHref = "#" as const;
