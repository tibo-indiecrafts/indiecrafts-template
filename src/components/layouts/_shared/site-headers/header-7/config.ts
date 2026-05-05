/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Header content (brand + nav links) is intentionally minimal — links
 * come from the global `headerNav` (`src/config/navigation.config.ts`)
 * so all header variants render the same items. Local strings here
 * cover only the component-specific aria-labels.
 */
export const header7Key = "header-7" as const;
export const header7Namespace = "blocks.header-7" as const;
