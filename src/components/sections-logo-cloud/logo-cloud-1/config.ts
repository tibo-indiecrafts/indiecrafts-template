/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * The brand-logo set lives inline in `LogoCloud.tsx` (each logo is a
 * typed React SVG component, not a string). All visible labels (intro
 * sentence + per-group highlight phrases) translate via `./en.json`.
 */
export const logoCloud1Key = "logo-cloud-1" as const;
export const logoCloud1Namespace = "blocks.logo-cloud-1" as const;
