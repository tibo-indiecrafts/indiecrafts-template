/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * The brand-logo set lives inline in `LogoCloud.tsx` (each logo is a
 * typed React SVG component, not a string). All visible labels (intro
 * sentence + per-group highlight phrases) translate via `./en.json`.
 */
export const logoCloud01Key = "logo-cloud-01" as const;
export const logoCloud01Namespace = "blocks.logo-cloud-01" as const;
