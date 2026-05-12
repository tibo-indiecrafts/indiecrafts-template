/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Secondary hero — billing pitch. Left tagged headline + body + dual
 * CTAs + 2-stat row; right composite illustration (workplace photo
 * with an invoice card overlaid on top via blurred radial mask). All
 * visible strings translate via `./en.json`.
 */
export const secondaryHero20Key = "secondary-hero-20" as const;
export const secondaryHero20Namespace = "blocks.secondary-hero-20" as const;

/** Primary CTA target. */
export const secondaryHero20PrimaryCtaHref = "#" as const;
/** Secondary CTA target. */
export const secondaryHero20SecondaryCtaHref = "#" as const;

/** Workplace photo URL behind the invoice. */
export const secondaryHero20BackgroundImage =
  "https://raw.githubusercontent.com/acme/assets/refs/heads/main/work4_c0ffmk.webp" as const;
