import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarProvider, SidebarInset } from "@/components/ui-primitives/sidebar";
import { Sidebar07 } from "./index";
import { sidebar07Data } from "./config";

const meta: Meta<typeof Sidebar07> = {
  title: "Layouts/Dashboard/Sidebars/Sidebar07",
  component: Sidebar07,
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

type Story = StoryObj<typeof Sidebar07>;

export const Default: Story = {};

export const Minimal: Story = {
  args: {
    data: {
      ...sidebar07Data,
      navMain: [sidebar07Data.navMain[0]],
      navSecondary: [],
      documents: [],
    },
  },
};
