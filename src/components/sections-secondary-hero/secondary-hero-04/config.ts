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
export const secondaryHero04Key = "secondary-hero-04" as const;
export const secondaryHero04Namespace = "blocks.secondary-hero-04" as const;

/** Backdrop photo URL. */
export const secondaryHero04BackgroundImage =
  "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/3d_gsnqq2.webp" as const;
