/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Hero composes a left column (headline + body + dual CTAs + 2-stat
 * row) paired with a right-floated `ProductCarousel` auto-cycler, plus
 * a flat brand `LogoCloud` strip below. All visible strings translate
 * via `./en.json`; visual assets come from `ui-illustrations` and
 * `sections-logo-cloud`.
 */
export const hero11Key = "hero-11" as const;
export const hero11Namespace = "blocks.hero-11" as const;

/** Primary CTA target. */
export const hero11PrimaryCtaHref = "#" as const;
/** Secondary CTA target. */
export const hero11SecondaryCtaHref = "#" as const;
