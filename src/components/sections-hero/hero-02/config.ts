/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Background art URLs (light + dark) live here so swapping them is a
 * config edit, not a JSX edit. The illustration component
 * (`MobileWalletIllustration`) is imported directly in `Hero.tsx`
 * because it's a typed React component, not a string asset.
 */
export const hero02Key = "hero-02" as const;
export const hero02Namespace = "blocks.hero-02" as const;

/** Background art for the hero — light/dark variants. */
export const hero02BackgroundImage = {
  light:
    "https://raw.githubusercontent.com/acme/assets/refs/heads/main/clouds_blcfda.jpg",
  dark: "https://images.unsplash.com/photo-1602517300834-9dc3336a714f?q=80&w=2719&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
} as const;

/** App-store CTAs — caller can override per-callsite. */
export const hero02IphoneHref = "#" as const;
export const hero02AndroidHref = "#" as const;
