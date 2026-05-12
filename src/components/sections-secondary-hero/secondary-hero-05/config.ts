/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Secondary hero — left-aligned tagged headline + body + small CTA,
 * paired with the `BillingGrid` illustration (dashed-grid frame
 * containing the `BillingTable`) over a soft photo backdrop. All
 * visible strings translate via `./en.json`; visuals come from
 * `ui-illustrations`. The backdrop photo URL lives in this config so
 * projects can override it.
 */
export const secondaryHero05Key = "secondary-hero-05" as const;
export const secondaryHero05Namespace = "blocks.secondary-hero-05" as const;

/** Primary CTA target. */
export const secondaryHero05CtaHref = "#" as const;

/** Light-mode backdrop photo URL behind the billing grid. */
export const secondaryHero05BackgroundImage =
  "https://images.unsplash.com/photo-1740516367183-90f0b6094907?q=80&w=2300&auto=format&fit=crop" as const;
