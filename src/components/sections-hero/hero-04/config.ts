/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Hero composes a top "announcement chip" + bordered headline + dual
 * CTA + framed `ProductIllustration` + `LogoCloud` trust strip. All
 * visible strings translate via `./en.json`; visual assets are
 * imported from `ui-illustrations` and `sections-logo-cloud`.
 */
export const hero04Key = "hero-04" as const;
export const hero04Namespace = "blocks.hero-04" as const;

/** Announcement-chip "Read" link target. */
export const hero04AnnouncementHref = "#" as const;
/** Primary CTA target. */
export const hero04PrimaryCtaHref = "#" as const;
/** Secondary CTA target. */
export const hero04SecondaryCtaHref = "#" as const;
