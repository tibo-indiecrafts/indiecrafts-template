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

/** Default — avatar empty, the fallback initials chip is rendered. */
export const Default: Story = {
  args: {
    user: {
      name: "Jane Doe",
      email: "jane@example.com",
      avatar: "",
    },
  },
};

/** Avatar URL provided — `AvatarImage` loads, `AvatarFallback` stays hidden. */
export const WithAvatar: Story = {
  args: {
    user: {
      name: "Jane Doe",
      email: "jane@example.com",
      avatar: "https://i.pravatar.cc/96?img=47",
    },
  },
};

/** Long name + email — exercises the `truncate` styling on both lines. */
export const LongIdentity: Story = {
  args: {
    user: {
      name: "Maximilian Wellington-Hartford III",
      email: "max.wellington-hartford-the-third@verylongdomain.example.com",
      avatar: "",
    },
  },
};
