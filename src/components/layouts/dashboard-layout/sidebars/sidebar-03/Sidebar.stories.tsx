import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarProvider } from "@/components/ui-primitives/sidebar";
import { Sidebar03 } from "./index";

const meta: Meta<typeof Sidebar03> = {
  title: "Layouts/Dashboard/Sidebars/Sidebar03",
  component: Sidebar03,
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

type Story = StoryObj<typeof Sidebar03>;

export const Default: Story = {};
