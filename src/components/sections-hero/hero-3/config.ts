/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Hero composes a top headline + CTA, the `ProductIllustration`
 * dashboard-mock visual (from `ui-illustrations`), and the `LogoCloud`
 * trust strip (from `ui-molecules`). All visible strings translate via
 * `./en.json`; the assets are imported as React components in `Hero.tsx`.
 */
export const hero3Key = "hero-3" as const;
export const hero3Namespace = "blocks.hero-3" as const;

/** Primary CTA target — caller can override per-callsite. */
export const hero3CtaHref = "#" as const;
