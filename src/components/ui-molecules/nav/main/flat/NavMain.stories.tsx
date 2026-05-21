import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconLifebuoy,
  IconListDetails,
  IconUsers,
} from "@tabler/icons-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
} from "@/components/ui-primitives/sidebar";
import { NavMain } from "./NavMain";

const meta: Meta<typeof NavMain> = {
  title: "UI Molecules/Nav/Main/Flat",
  component: NavMain,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarContent>
            <Story />
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof NavMain>;

export const Default: Story = {
  args: {
    items: [
      { title: "Dashboard", url: "/", icon: IconDashboard },
      { title: "Analytics", url: "/analytics", icon: IconChartBar },
      { title: "Projects", url: "/projects", icon: IconFolder },
      { title: "Team", url: "/team", icon: IconUsers },
    ],
  },
};

export const ExtendedNav: Story = {
  args: {
    items: [
      { title: "Dashboard", url: "/", icon: IconDashboard },
      { title: "Lifecycle", url: "/lifecycle", icon: IconListDetails },
      { title: "Analytics", url: "/analytics", icon: IconChartBar },
      { title: "Projects", url: "/projects", icon: IconFolder },
      { title: "Team", url: "/team", icon: IconUsers },
      { title: "Support", url: "/support", icon: IconLifebuoy },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ title: "Dashboard", url: "/", icon: IconDashboard }],
  },
};

export const WithoutIcons: Story = {
  args: {
    items: [
      { title: "Overview", url: "/overview" },
      { title: "Reports", url: "/reports" },
      { title: "Settings", url: "/settings" },
    ],
  },
};
