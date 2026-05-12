/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Secondary hero — large editorial headline + asymmetric body copy
 * over a `CursorGlowPhoto` (full-bleed photo with cursor-tracking
 * blurred overlay). All visible strings translate via `./en.json`;
 * the photo URL lives in this config so projects override it without
 * touching the component.
 */
export const secondaryHero02Key = "secondary-hero-02" as const;
export const secondaryHero02Namespace = "blocks.secondary-hero-02" as const;

/** Backdrop photo URL. */
export const secondaryHero02BackgroundImage =
  "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/healthcare_ttc35b.jpg" as const;
