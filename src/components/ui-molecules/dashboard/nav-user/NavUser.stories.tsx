import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  SidebarProvider,
  Sidebar,
  SidebarFooter,
} from "@/components/ui-primitives/sidebar";
import { NavUser } from "./NavUser";

const meta: Meta<typeof NavUser> = {
  title: "UI Molecules/Dashboard/NavUser",
  component: NavUser,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarFooter>
            <Story />
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof NavUser>;

export const Default: Story = {
  args: {
    user: {
      name: "Jane Doe",
      email: "jane@example.com",
      avatar: "",
    },
  },
};

export const WithAvatar: Story = {
  args: {
    user: {
      name: "Jane Doe",
      email: "jane@example.com",
      avatar: "https://i.pravatar.cc/96?img=47",
    },
  },
};

export const LongIdentity: Story = {
  args: {
    user: {
      name: "Maximilian Wellington-Hartford III",
      email: "max.wellington-hartford-the-third@verylongdomain.example.com",
      avatar: "",
    },
  },
};
