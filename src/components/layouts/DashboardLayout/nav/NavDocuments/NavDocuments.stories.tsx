import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IconDatabase, IconFileWord, IconReport } from "@tabler/icons-react";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui-primitives/sidebar";
import { NavDocuments } from "./index";

const meta: Meta<typeof NavDocuments> = {
  title: "Layouts/Dashboard/Nav/NavDocuments",
  component: NavDocuments,
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

type Story = StoryObj<typeof NavDocuments>;

export const Default: Story = {
  args: {
    items: [
      { name: "Data Library", url: "/library", icon: IconDatabase },
      { name: "Reports", url: "/reports", icon: IconReport },
      { name: "Word Assistant", url: "/assistant", icon: IconFileWord },
    ],
  },
};
