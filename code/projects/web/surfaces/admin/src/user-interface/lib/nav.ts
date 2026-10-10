/**
 * Define the admin sidebar navigation and resolve the active item.
 *
 * @see docs/reference/projects/web/admin/src/user-interface/lib/nav.md
 */
import {
  LayoutDashboard,
  Users,
  MonitorSmartphone,
  FileText,
  ShieldAlert,
  UserMinus,
  DatabaseBackup,
  Server,
  Settings,
  ShieldCheck,
  Clock,
  Hourglass,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { localeCodes } from "@/config";

export type NavItem = { key: string; href: string; icon: LucideIcon };
export type NavGroup = { labelKey: string | null; items: NavItem[] };

export const NAV: NavGroup[] = [
  { labelKey: null, items: [{ key: "overview", href: "/", icon: LayoutDashboard }] },
  {
    labelKey: "access",
    items: [
      { key: "users", href: "/users", icon: Users },
      { key: "sessions", href: "/sessions", icon: MonitorSmartphone },
    ],
  },
  {
    labelKey: "compliance",
    items: [
      { key: "dataRequests", href: "/data-requests", icon: FileText },
      { key: "contacts", href: "/contacts", icon: Mail },
      { key: "erasure", href: "/erasure", icon: Hourglass },
      { key: "csp", href: "/csp", icon: ShieldAlert },
      { key: "churn", href: "/churn", icon: UserMinus },
    ],
  },
  {
    labelKey: "operations",
    items: [
      { key: "backups", href: "/backups", icon: DatabaseBackup },
      { key: "cron", href: "/cron", icon: Clock },
      { key: "system", href: "/system", icon: Server },
      { key: "settings", href: "/settings", icon: Settings },
    ],
  },
  { labelKey: "security", items: [{ key: "security", href: "/security", icon: ShieldCheck }] },
];

// Matches an optional leading `/<locale>` segment (e.g. `/en`, `/fr`) — built from the
// registered locale codes rather than hardcoded, so a new locale needs no change here.
const LOCALE_PREFIX = new RegExp(`^/(${localeCodes.join("|")})(?=/|$)`);

/** Strip the optional locale prefix, then pick the item whose href is the longest matching prefix. `/` → overview. */
export function activeKey(pathname: string): string | undefined {
  const p = pathname.replace(LOCALE_PREFIX, "") || "/";
  const items = NAV.flatMap((g) => g.items);
  const match = items
    .filter((i) => (i.href === "/" ? p === "/" : p === i.href || p.startsWith(i.href + "/")))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.key;
}
