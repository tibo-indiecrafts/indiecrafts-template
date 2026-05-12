import {
  IconAd2,
  IconBellRinging,
  IconCalendar,
  IconCalendarStats,
  IconListDetails,
  IconNews,
  IconNotebook,
  IconProgressCheck,
  IconSettingsCode,
} from "@tabler/icons-react";
import { LayoutDashboard, Package } from "lucide-react";
import type { SidebarData } from "./types";

export const sidebar01Key = "sidebar-01" as const;

export const sidebar01Namespace = "blocks.sidebar-01" as const;

export const sidebar01Data: SidebarData = {
  user: {
    name: "ephraim",
    email: "ephraim@blocks.so",
    avatar: "/avatar-01.png",
  },
  navMain: [
    { id: "overview", icon: LayoutDashboard, isActive: true },
    { id: "tasks", icon: IconListDetails },
    { id: "meetings", icon: IconCalendarStats },
    { id: "notes", icon: IconNotebook },
    { id: "calendar", icon: IconCalendar },
    { id: "completed", icon: IconProgressCheck },
    { id: "notifications", icon: IconBellRinging },
  ],
  navCollapsible: {
    favorites: [
      { id: "design", color: "bg-green-400 dark:bg-green-300" },
      { id: "development", color: "bg-blue-400 dark:bg-blue-300" },
      { id: "workshop", color: "bg-orange-400 dark:bg-orange-300" },
      { id: "personal", color: "bg-red-400 dark:bg-red-300" },
    ],
    teams: [
      { id: "engineering", icon: IconSettingsCode },
      { id: "marketing", icon: IconAd2 },
    ],
    topics: [
      { id: "product-updates", icon: Package },
      { id: "company-news", icon: IconNews },
    ],
  },
};

export const sidebar01Sample = {} as const;
