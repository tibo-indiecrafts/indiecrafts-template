/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Header content (brand + nav links) is intentionally minimal — links
 * come from the global `headerNav` (`src/config/navigation.config.ts`)
 * so all header variants render the same items. Local strings here
 * cover only the component-specific aria-labels.
 */
export const header4Key = "header-4" as const;
export const header4Namespace = "blocks.header-4" as const;

/** CTA target. Cast at the call-site to satisfy the typed `Link`. */
export const header4CtaHref = "/signup" as const;
