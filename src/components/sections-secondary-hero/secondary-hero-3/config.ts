/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Secondary hero — leads with the `Integrations` illustration (brand
 * tiles on a dashed grid) and pairs it with a tagged headline + body
 * + CTA. All visible strings translate via `./en.json`; the
 * illustration lives in `ui-illustrations/integrations`.
 */
export const secondaryHero3Key = "secondary-hero-3" as const;
export const secondaryHero3Namespace = "blocks.secondary-hero-3" as const;

/** Primary CTA target. */
export const secondaryHero3CtaHref = "#" as const;
