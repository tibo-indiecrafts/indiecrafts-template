import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarProvider } from "@/components/ui-primitives/sidebar";
import { Sidebar06 } from "./index";

const meta: Meta<typeof Sidebar06> = {
  title: "Layouts/Dashboard/Sidebars/Sidebar06",
  component: Sidebar06,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
      </SidebarProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Sidebar06>;

export const Default: Story = {};
