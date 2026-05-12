import type { ElementType } from "react";

export const teamSwitcherFlatKey = "team-switcher-flat" as const;

export const teamSwitcherFlatNamespace = "blocks.team-switcher-flat" as const;

export type TeamSwitcherFlatTeam = {
  name: string;
  logo: ElementType;
  plan: string;
};
