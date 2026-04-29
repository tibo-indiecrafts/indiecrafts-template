import type { ElementType } from "react";

/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const teamSwitcherKey = "team-switcher" as const;

/**
 * Translation namespace — `useTranslations(teamSwitcherNamespace)` resolves keys from `en.json`.
 */
export const teamSwitcherNamespace = "blocks.team-switcher" as const;

export type TeamSwitcherTeam = {
  name: string;
  logo: ElementType;
  plan: string;
};
