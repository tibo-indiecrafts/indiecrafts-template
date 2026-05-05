import type { ElementType } from "react";

/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const dashboardTeamSwitcherKey = "dashboard-team-switcher" as const;

/**
 * Translation namespace — `useTranslations(dashboardTeamSwitcherNamespace)` resolves keys from `en.json`.
 */
export const dashboardTeamSwitcherNamespace = "blocks.dashboard-team-switcher" as const;

export type DashboardTeamSwitcherTeam = {
  name: string;
  logo: ElementType;
  plan: string;
};
