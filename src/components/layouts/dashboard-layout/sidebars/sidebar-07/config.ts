import type { ComponentType } from "react";
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

export const sidebar07Key = "sidebar-07" as const;

export const sidebar07Namespace = "blocks.sidebar-07" as const;

export type SidebarIcon = ComponentType<{ className?: string }>;

export type SidebarNavItem = {
  titleKey: string;
  url: string;
  icon?: SidebarIcon;
};

export type SidebarDocumentItem = {
  nameKey: string;
  url: string;
  icon: SidebarIcon;
};

export type SidebarUser = {
  name: string;
  email: string;
  avatar: string;
};

export type SidebarData = {
  brandHref: string;
  user: SidebarUser;
  navMain: SidebarNavItem[];
  navSecondary: SidebarNavItem[];
  documents: SidebarDocumentItem[];
};

export const sidebar07Data: SidebarData = {
  brandHref: "/",
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    { titleKey: "navMain.dashboard", url: "/dashboard", icon: IconDashboard },
    { titleKey: "navMain.lifecycle", url: "/lifecycle", icon: IconListDetails },
    { titleKey: "navMain.analytics", url: "/analytics", icon: IconChartBar },
    { titleKey: "navMain.projects", url: "/projects", icon: IconFolder },
    { titleKey: "navMain.team", url: "/team", icon: IconUsers },
  ],
  navSecondary: [
    { titleKey: "navSecondary.settings", url: "/settings", icon: IconSettings },
    { titleKey: "navSecondary.help", url: "/help", icon: IconHelp },
    { titleKey: "navSecondary.search", url: "/search", icon: IconSearch },
  ],
  documents: [
    { nameKey: "documents.library", url: "/library", icon: IconDatabase },
    { nameKey: "documents.reports", url: "/reports", icon: IconReport },
    { nameKey: "documents.assistant", url: "/assistant", icon: IconFileWord },
  ],
};
