import type { ElementType } from "react";

export const dashboardTeamSwitcherKey = "dashboard-team-switcher" as const;

export const dashboardTeamSwitcherNamespace = "blocks.dashboard-team-switcher" as const;

export type DashboardTeamSwitcherTeam = {
  name: string;
  logo: ElementType;
  plan: string;
};
