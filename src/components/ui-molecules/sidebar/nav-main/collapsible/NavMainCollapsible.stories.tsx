import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  IconBellRinging,
  IconCalendar,
  IconCalendarStats,
  IconListDetails,
  IconNotebook,
  IconProgressCheck,
} from "@tabler/icons-react";
import { LayoutDashboard } from "lucide-react";
import { Sidebar, SidebarProvider } from "@/components/ui-primitives/sidebar";
import { NavMainCollapsible } from "./NavMainCollapsible";

const meta: Meta<typeof NavMainCollapsible> = {
  title: "UI Molecules/Sidebar/NavMain/Collapsible",
  component: NavMainCollapsible,
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
type Story = StoryObj<typeof NavMainCollapsible>;

export const Default: Story = {
  args: {
    items: [
      { id: "overview", icon: LayoutDashboard, isActive: true },
      { id: "tasks", icon: IconListDetails },
      { id: "meetings", icon: IconCalendarStats },
      { id: "notes", icon: IconNotebook },
      { id: "calendar", icon: IconCalendar },
      { id: "completed", icon: IconProgressCheck },
      { id: "notifications", icon: IconBellRinging },
    ],
  },
};
