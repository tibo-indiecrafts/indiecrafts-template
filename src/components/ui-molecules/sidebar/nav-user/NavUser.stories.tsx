import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Sidebar, SidebarProvider } from "@/components/ui-primitives/sidebar";
import { MailProvider } from "@/components/layouts/dashboard-layout/sidebars/sidebar-04/mail-context";
import { NavUser } from "./NavUser";

const meta: Meta<typeof NavUser> = {
  title: "UI Molecules/Sidebar/NavUser",
  component: NavUser,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <MailProvider>
        <SidebarProvider>
          <Sidebar>
            <div className="px-2 py-4">
              <Story />
            </div>
          </Sidebar>
        </SidebarProvider>
      </MailProvider>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof NavUser>;

export const Default: Story = {
  args: {
    user: {
      name: "ephraim",
      email: "ephraim@blocks.so",
      avatar: "/avatar-01.png",
    },
  },
};
