import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarProvider } from "@/components/ui-primitives/sidebar";
import { Sidebar02 } from "./index";

const meta: Meta<typeof Sidebar02> = {
  title: "Layouts/Dashboard/Sidebars/Sidebar02",
  component: Sidebar02,
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

type Story = StoryObj<typeof Sidebar02>;

export const Default: Story = {};
