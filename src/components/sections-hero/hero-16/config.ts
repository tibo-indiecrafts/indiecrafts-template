/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Hero composes a centered headline (with a plain-styled accent span)
 * + body + a single rounded-pill CTA, paired with the wide
 * `PaymentsDiagram` illustration (with animated SVG beam connections),
 * followed by a 3-column features row beneath. All visible strings
 * translate via `./en.json`; the diagram lives in `ui-illustrations`.
 */
export const hero16Key = "hero-16" as const;
export const hero16Namespace = "blocks.hero-16" as const;

/** Primary CTA target. */
export const hero16CtaHref = "/pricing" as const;
