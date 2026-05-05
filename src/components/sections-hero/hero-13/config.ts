/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Hero composes a centered headline (with inline animated audio-lines
 * icon) + body + parallax-on-scroll image card with a Watch-demo
 * pill. Below the section a compact `LogoCloud` strip. All visible
 * strings translate via `./en.json`; the parallax image effect lives
 * in `ui-effects/parallax-image`, the animated audio icon in
 * `ui-illustrations/audio-lines`. The hero background photo URL lives
 * in this config so projects override it without touching the
 * component.
 */
export const hero13Key = "hero-13" as const;
export const hero13Namespace = "blocks.hero-13" as const;

/**
 * Light-theme backdrop image URL (overlaid behind the hero on light
 * pages; hidden in dark mode via `dark:hidden`).
 */
export const hero13BackgroundImage =
  "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=2070&auto=format&fit=crop" as const;
