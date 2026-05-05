import type { Meta, StoryObj } from "@storybook/nextjs-vite";
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
import { Sidebar, SidebarProvider } from "@/components/ui-primitives/sidebar";
import { NavHeader } from "./NavHeader";
import type { SidebarData } from "@/components/layouts/dashboard-layout/sidebars/sidebar-01/types";

const sampleData: SidebarData = {
  user: { name: "ephraim", email: "ephraim@blocks.so", avatar: "/avatar-01.png" },
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

const meta: Meta<typeof NavHeader> = {
  title: "UI Molecules/Sidebar/NavHeader",
  component: NavHeader,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Sidebar>
          <Story />
        </Sidebar>
      </SidebarProvider>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof NavHeader>;

export const Default: Story = {
  args: { data: sampleData },
};
