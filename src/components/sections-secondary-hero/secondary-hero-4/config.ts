/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Secondary hero — full-bleed `CursorGlowPhoto` (architectural 3D
 * photo with cursor-tracking blurred overlay) over a two-column
 * headline + body layout. All visible strings translate via
 * `./en.json`; the photo URL lives in this config so projects override
 * it without touching the component.
 */
export const secondaryHero4Key = "secondary-hero-4" as const;
export const secondaryHero4Namespace = "blocks.secondary-hero-4" as const;

/** Backdrop photo URL. */
export const secondaryHero4BackgroundImage =
  "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/3d_gsnqq2.webp" as const;
