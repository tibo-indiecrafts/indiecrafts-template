import { headerNav, type NavLink } from "@/config/navigation.config";

export const siteDrawerKey = "site-drawer" as const;
export const siteDrawerNamespace = "blocks.site-drawer" as const;

export type SiteDrawerDirection = "left" | "right";
export type SiteDrawerButtonOpening = "push" | "merge" | "stay";

export interface SiteDrawerDefaults {
  direction: SiteDrawerDirection;
  buttonOpeningVariants: SiteDrawerButtonOpening;
  width: number;
  items: NavLink[];
}

export const siteDrawerDefaults: SiteDrawerDefaults = {
  direction: "left",
  buttonOpeningVariants: "merge",
  width: 280,
  items: headerNav,
};
