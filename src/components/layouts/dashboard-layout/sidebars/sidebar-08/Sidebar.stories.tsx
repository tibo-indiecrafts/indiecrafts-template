import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarProvider, SidebarInset } from "@/components/ui-primitives/sidebar";
import { Sidebar08 } from "./index";
import { sidebar08Data } from "./config";

const meta: Meta<typeof Sidebar08> = {
  title: "Layouts/Dashboard/Sidebars/Sidebar08",
  component: Sidebar08,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
        <SidebarInset>
          <div className="p-6 text-sm">Sidebar preview area</div>
        </SidebarInset>
      </SidebarProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Sidebar08>;

export const Default: Story = {};

export const Minimal: Story = {
  args: {
    data: {
      ...sidebar08Data,
      teams: [sidebar08Data.teams[0]],
      navMain: sidebar08Data.navMain.slice(0, 2),
      navSecondary: [],
      favorites: [],
      workspaces: [],
    },
  },
};
