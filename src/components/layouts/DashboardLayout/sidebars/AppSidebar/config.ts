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

/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const appSidebarKey = "app-sidebar" as const;

/**
 * Translation namespace — `useTranslations(appSidebarNamespace)` resolves keys from `en.json`.
 */
export const appSidebarNamespace = "blocks.app-sidebar" as const;

/** Icon component shape — accepts both tabler and lucide icons. */
export type SidebarIcon = ComponentType<{ className?: string }>;

export type AppSidebarNavItem = {
  /** Translation key for the item label, relative to the section namespace. */
  titleKey: string;
  url: string;
  icon?: SidebarIcon;
};

export type AppSidebarDocumentItem = {
  /** Translation key for the document name, relative to the section namespace. */
  nameKey: string;
  url: string;
  icon: SidebarIcon;
};

export type AppSidebarUser = {
  name: string;
  email: string;
  avatar: string;
};

export type AppSidebarData = {
  brandHref: string;
  user: AppSidebarUser;
  navMain: AppSidebarNavItem[];
  navSecondary: AppSidebarNavItem[];
  documents: AppSidebarDocumentItem[];
};

export const appSidebarData: AppSidebarData = {
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
