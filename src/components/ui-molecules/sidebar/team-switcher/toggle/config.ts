/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 *
 * Holds FIXED labels of the team-switcher dropdown (header label, add-team
 * action). Variable content (team names, plan labels) flows from the
 * parent's namespace via the `namespace` prop.
 */
export const sidebarTeamSwitcherToggleKey = "sidebar-team-switcher-toggle" as const;

/**
 * Translation namespace — `useTranslations(sidebarTeamSwitcherToggleNamespace)` resolves keys from `en.json`.
 */
export const sidebarTeamSwitcherToggleNamespace =
  "blocks.sidebar-team-switcher-toggle" as const;
