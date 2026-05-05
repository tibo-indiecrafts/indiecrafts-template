import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarProvider } from "@/components/ui-primitives/sidebar";
import { MailProvider, Sidebar04 } from "./index";

const meta: Meta<typeof Sidebar04> = {
  title: "Layouts/Dashboard/Sidebars/Sidebar04",
  component: Sidebar04,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <MailProvider>
          <Story />
        </MailProvider>
      </SidebarProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Sidebar04>;

export const Default: Story = {};
