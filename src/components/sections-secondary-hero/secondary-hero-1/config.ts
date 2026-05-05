/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Secondary hero — designed to sit BELOW a primary hero on landing
 * pages, introducing a focused product feature with an animated chat
 * mock above the headline + body + CTA. All visible strings translate
 * via `./en.json`; the chat mock lives in `ui-illustrations/chat`.
 */
export const secondaryHero1Key = "secondary-hero-1" as const;
export const secondaryHero1Namespace = "blocks.secondary-hero-1" as const;

/** Primary CTA target. */
export const secondaryHero1CtaHref = "#" as const;
