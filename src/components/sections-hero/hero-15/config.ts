/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Hero composes a centered `CreditCard` mock + headline (with a
 * gradient-clipped accent span) + body + a single rounded-pill CTA,
 * with a compact `LogoCloud` strip below. All visible strings
 * translate via `./en.json`. The hero overrides
 * `--color-foreground` to indigo-950 in light mode (white in dark)
 * for an enriched headline color — preserved from the Tailark source.
 */
export const hero15Key = "hero-15" as const;
export const hero15Namespace = "blocks.hero-15" as const;

/** Primary CTA target. */
export const hero15CtaHref = "/pricing" as const;
