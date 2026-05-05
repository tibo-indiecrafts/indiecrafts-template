import {
  IconBell,
  IconBolt,
  IconCalendar,
  IconChartBar,
  IconChartPie,
  IconClock,
  IconFileText,
  IconHelp,
  IconKeyboard,
  IconLayoutDashboard,
  IconLayoutKanban,
  IconLogout,
  IconMessage,
  IconPalette,
  IconSettings,
  IconSquareCheck,
  IconTarget,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import type { CommandMenuBlock, CommandMenuItem } from "./schema";

export const commandMenu01Key = "command-menu-01" as const;
export const commandMenu01Namespace = "blocks.command-menu-01" as const;

export const commandMenu01WorkspaceItems: CommandMenuItem[] = [
  { id: "dashboard", icon: IconLayoutDashboard },
  { id: "projects", icon: IconLayoutKanban },
  { id: "tasks", icon: IconSquareCheck },
  { id: "calendar", icon: IconCalendar },
  { id: "team-members", icon: IconUsers },
  { id: "messages", icon: IconMessage },
  { id: "documents", icon: IconFileText },
  { id: "notifications", icon: IconBell },
  { id: "time-tracking", icon: IconClock },
  { id: "goals", icon: IconTarget },
];

export const commandMenu01AnalyticsItems: CommandMenuItem[] = [
  { id: "overview", icon: IconChartBar },
  { id: "performance", icon: IconTrendingUp },
  { id: "reports", icon: IconChartPie },
  { id: "insights", icon: IconBolt },
];

export const commandMenu01SettingsItems: CommandMenuItem[] = [
  { id: "preferences", icon: IconSettings },
  { id: "appearance", icon: IconPalette },
  { id: "keyboard-shortcuts", icon: IconKeyboard },
  { id: "help-support", icon: IconHelp },
  { id: "sign-out", icon: IconLogout },
];

export const commandMenu01Sample: Omit<CommandMenuBlock, "id"> = {
  type: "command-menu-01",
  defaultOpen: true,
};
