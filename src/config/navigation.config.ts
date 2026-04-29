/**
 * Navigation — header menus and footer sections.
 *
 * `href` values must be keys registered in routes.types.ts AND pages/index.ts.
 * The <Link> component translates them per active locale.
 * `labelKey` points into messages/<locale>.json under `nav.<labelKey>`.
 */

import type { StaticAppPathname } from "./routes.types";
import type globalEn from "../../messages/en.json";

/** Key inside the `nav` namespace in messages/<locale>.json. */
type NavLabelKey = keyof typeof globalEn.nav;

export type NavLink = {
  labelKey: NavLabelKey;
  href: StaticAppPathname;
  /** Optional external URL (used instead of href when set) */
  external?: string;
};

export type NavGroup = {
  labelKey: NavLabelKey;
  links: NavLink[];
};

export const headerNav: NavLink[] = [
  { labelKey: "home", href: "/" },
  { labelKey: "about", href: "/about" },
];

export const footerNav: NavGroup[] = [
  {
    labelKey: "company",
    links: [{ labelKey: "about", href: "/about" }],
  },
];
