/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Hero composes a heading + body + dual CTAs over a soft photo
 * gradient backdrop, with the animated `ProductTabs` switcher
 * underneath and a `LogoCloud` trust strip below the section. All
 * visible strings translate via `./en.json`; visual assets come from
 * `ui-illustrations` and `sections-logo-cloud`.
 */
export const hero08Key = "hero-08" as const;
export const hero08Namespace = "blocks.hero-08" as const;

/** Primary CTA target. */
export const hero08PrimaryCtaHref = "#" as const;
/** Secondary CTA target. */
export const hero08SecondaryCtaHref = "#" as const;

/** Light-theme backdrop image URL. */
export const hero08BackgroundImageLight =
  "https://images.unsplash.com/photo-1681238337823-9a0a954baab0?q=80&w=2156&auto=format&fit=crop" as const;
/** Dark-theme backdrop image URL. */
export const hero08BackgroundImageDark =
  "https://images.unsplash.com/photo-1655823855230-7f3b6bdd72fb?q=80&w=3115&auto=format&fit=crop" as const;
