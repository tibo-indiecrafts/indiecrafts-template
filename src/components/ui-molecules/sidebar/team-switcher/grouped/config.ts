/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 *
 * Holds FIXED labels of the team-switcher dropdown (header label, add-team
 * action). Variable content (team names, plan labels) flows from the
 * parent's namespace via the `namespace` prop.
 */
export const sidebarTeamSwitcherGroupedKey = "sidebar-team-switcher-grouped" as const;

/**
 * Translation namespace — `useTranslations(sidebarTeamSwitcherGroupedNamespace)` resolves keys from `en.json`.
 */
export const sidebarTeamSwitcherGroupedNamespace =
  "blocks.sidebar-team-switcher-grouped" as const;
