/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Hero composes a "New" announcement chip + serif headline + single
 * pill CTA + framed `ProductIllustration` over a soft photo backdrop +
 * `LogoCloud` trust strip. All visible strings translate via
 * `./en.json`; visual assets are imported from `ui-illustrations` and
 * `sections-logo-cloud`.
 */
export const hero06Key = "hero-06" as const;
export const hero06Namespace = "blocks.hero-06" as const;

/** Announcement chip target. */
export const hero06AnnouncementHref = "#" as const;
/** Primary CTA target. */
export const hero06CtaHref = "#" as const;
/**
 * Background photo behind the framed illustration. Override per project
 * by editing this URL (Unsplash placeholder ships by default).
 */
export const hero06BackgroundImage =
  "https://images.unsplash.com/photo-1695151992691-a9e19f73948f?q=80&w=2206&auto=format&fit=crop" as const;
