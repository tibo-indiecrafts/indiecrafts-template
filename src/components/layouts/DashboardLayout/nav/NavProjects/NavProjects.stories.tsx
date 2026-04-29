import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Briefcase, Folder, Star } from "lucide-react";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui-primitives/sidebar";
import { NavProjects } from "./index";

const meta: Meta<typeof NavProjects> = {
  title: "Layouts/Dashboard/Nav/NavProjects",
  component: NavProjects,
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

type Story = StoryObj<typeof NavProjects>;

export const Default: Story = {
  args: {
    projects: [
      { name: "Marketing site", url: "#", icon: Star },
      { name: "Internal tools", url: "#", icon: Briefcase },
      { name: "Archive", url: "#", icon: Folder },
    ],
  },
};
