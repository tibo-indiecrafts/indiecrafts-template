import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarProvider } from "@/components/ui-primitives/sidebar";
import { Sidebar05 } from "./index";

const meta: Meta<typeof Sidebar05> = {
  title: "Layouts/Dashboard/Sidebars/Sidebar05",
  component: Sidebar05,
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

type Story = StoryObj<typeof Sidebar05>;

export const Default: Story = {};
