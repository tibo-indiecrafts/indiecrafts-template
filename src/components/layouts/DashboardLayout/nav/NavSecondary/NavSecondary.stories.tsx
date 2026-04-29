import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IconHelp, IconSearch, IconSettings } from "@tabler/icons-react";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui-primitives/sidebar";
import { NavSecondary } from "./index";

const meta: Meta<typeof NavSecondary> = {
  title: "Layouts/Dashboard/Nav/NavSecondary",
  component: NavSecondary,
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

type Story = StoryObj<typeof NavSecondary>;

export const Default: Story = {
  args: {
    items: [
      { title: "Settings", url: "/settings", icon: IconSettings },
      { title: "Help", url: "/help", icon: IconHelp },
      { title: "Search", url: "/search", icon: IconSearch },
    ],
  },
};
