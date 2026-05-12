import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Sidebar, SidebarProvider } from "@/components/ui-primitives/sidebar";
import { NavFooter } from "./NavFooter";

const meta: Meta<typeof NavFooter> = {
  title: "UI Molecules/Nav/Footer",
  component: NavFooter,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Sidebar>
          <Story />
        </Sidebar>
      </SidebarProvider>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof NavFooter>;

export const Default: Story = {
  args: {
    user: {
      name: "ephraim",
      email: "ephraim@blocks.so",
      avatar: "/avatar-01.png",
    },
  },
};
