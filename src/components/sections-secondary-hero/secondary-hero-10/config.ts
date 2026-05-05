/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Secondary hero — careers/recruiting layout. Two-color headline span
 * + body + CTA paired with a 3-photo collage (portrait / square / wide
 * landscape) in an asymmetric grid. All visible strings translate
 * via `./en.json`; photo URLs live here so projects override them
 * without touching the component.
 */
export const secondaryHero10Key = "secondary-hero-10" as const;
export const secondaryHero10Namespace = "blocks.secondary-hero-10" as const;

/** Primary CTA target. */
export const secondaryHero10CtaHref = "#" as const;

/** Portrait photo (right column, tall). */
export const secondaryHero10ImagePortrait =
  "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/work3_n5uspm.webp" as const;
/** Square photo (middle column). */
export const secondaryHero10ImageSquare =
  "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/work2_eoxbvk.webp" as const;
/** Wide landscape photo (full-row). */
export const secondaryHero10ImageWide =
  "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/work1_e1gkt8.webp" as const;
