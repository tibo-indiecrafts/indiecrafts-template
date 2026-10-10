/**
 * Define the app's flat sidebar nav and resolve the active item.
 *
 * @see docs/reference/projects/web/app/src/user-interface/lib/nav.md
 */
import { Home, UserRound, type LucideIcon } from "lucide-react";
import { localeCodes } from "@/config";

export type NavItem = { key: string; href: string; icon: LucideIcon };

/** The app's flat sidebar nav. Labels come from `messages.app.nav.*`. */
export const NAV: NavItem[] = [
  { key: "home", href: "/", icon: Home },
  { key: "account", href: "/account", icon: UserRound },
];

// Matches an optional leading `/<locale>` segment (e.g. `/en`, `/fr`) — built from the
// registered locale codes rather than hardcoded, so a new locale needs no change here.
const LOCALE_PREFIX = new RegExp(`^/(${localeCodes.join("|")})(?=/|$)`);

/** Strip the optional locale prefix, then pick the item whose href is the longest matching prefix. `/` → home. */
export function activeKey(pathname: string): string | undefined {
  const p = pathname.replace(LOCALE_PREFIX, "") || "/";
  return NAV.filter((i) =>
    i.href === "/" ? p === "/" : p === i.href || p.startsWith(i.href + "/"),
  ).sort((a, b) => b.href.length - a.href.length)[0]?.key;
}
