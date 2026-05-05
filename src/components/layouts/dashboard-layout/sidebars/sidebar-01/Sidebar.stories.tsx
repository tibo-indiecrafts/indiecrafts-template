import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarProvider } from "@/components/ui-primitives/sidebar";
import { Sidebar01 } from "./index";

const meta: Meta<typeof Sidebar01> = {
  title: "Layouts/Dashboard/Sidebars/Sidebar01",
  component: Sidebar01,
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

type Story = StoryObj<typeof Sidebar01>;

export const Default: Story = {};
