/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Secondary hero — full-width editorial layout. Headline above + body
 * paragraphs in a 2-column grid below, separated by the
 * `ScrollRevealImage` (clip + zoom on scroll). All visible strings
 * translate via `./en.json`; the backdrop URL lives here so projects
 * override it without touching the component. Strong text segments
 * within paragraphs use ICU rich-text via `tr()`.
 */
export const secondaryHero11Key = "secondary-hero-11" as const;
export const secondaryHero11Namespace = "blocks.secondary-hero-11" as const;

/** Backdrop image URL behind the scroll-reveal effect. */
export const secondaryHero11BackgroundImage =
  "https://raw.githubusercontent.com/acme/assets/refs/heads/main/flower_a5umwb.webp" as const;
