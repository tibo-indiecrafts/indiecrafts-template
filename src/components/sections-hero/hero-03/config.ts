/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Hero composes a top headline + CTA, the `ProductIllustration`
 * dashboard-mock visual (from `ui-illustrations`), and the `LogoCloud`
 * trust strip (from `ui-molecules`). All visible strings translate via
 * `./en.json`; the assets are imported as React components in `Hero.tsx`.
 */
export const hero03Key = "hero-03" as const;
export const hero03Namespace = "blocks.hero-03" as const;

/** Primary CTA target — caller can override per-callsite. */
export const hero03CtaHref = "#" as const;
