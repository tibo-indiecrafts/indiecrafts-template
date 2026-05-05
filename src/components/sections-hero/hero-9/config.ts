/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Hero composes a centered announcement chip + headline + body framed
 * by LED-pixel-strip CTA decorations, with the three-card
 * `ProductCards` gallery underneath and a `LogoCloud` trail. All
 * visible strings translate via `./en.json`; visual assets come from
 * `ui-illustrations` and `sections-logo-cloud`.
 */
export const hero9Key = "hero-9" as const;
export const hero9Namespace = "blocks.hero-9" as const;

/** Announcement chip "Read" link target. */
export const hero9AnnouncementHref = "#" as const;
/** Primary CTA target. */
export const hero9PrimaryCtaHref = "#" as const;
/** Secondary CTA target. */
export const hero9SecondaryCtaHref = "#" as const;
