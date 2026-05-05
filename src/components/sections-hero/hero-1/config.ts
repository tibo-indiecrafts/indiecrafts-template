/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * The hero's logo-cloud brand list lives in `Hero.tsx` because each
 * brand is rendered as a typed SVG component (no string identifier
 * cleanly captures it). Image asset URLs live here so swapping the
 * background art doesn't require touching the JSX.
 */
export const hero1Key = "hero-1" as const;
export const hero1Namespace = "blocks.hero-1" as const;

/** Background art for the hero — light/dark variants from Unsplash. */
export const hero1BackgroundImage = {
  light:
    "https://images.unsplash.com/photo-1740516367183-90f0b6094907?q=80&w=2300&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  dark: "https://images.unsplash.com/photo-1653919492307-6191a10280f4?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
} as const;

/** Internal/external CTA targets. Caller can override per-callsite. */
export const hero1PrimaryCtaHref = "#" as const;
export const hero1SecondaryCtaHref = "#" as const;
