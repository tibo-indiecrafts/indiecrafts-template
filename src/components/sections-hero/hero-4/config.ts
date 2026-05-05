/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Hero composes a top "announcement chip" + bordered headline + dual
 * CTA + framed `ProductIllustration` + `LogoCloud` trust strip. All
 * visible strings translate via `./en.json`; visual assets are
 * imported from `ui-illustrations` and `sections-logo-cloud`.
 */
export const hero4Key = "hero-4" as const;
export const hero4Namespace = "blocks.hero-4" as const;

/** Announcement-chip "Read" link target. */
export const hero4AnnouncementHref = "#" as const;
/** Primary CTA target. */
export const hero4PrimaryCtaHref = "#" as const;
/** Secondary CTA target. */
export const hero4SecondaryCtaHref = "#" as const;
