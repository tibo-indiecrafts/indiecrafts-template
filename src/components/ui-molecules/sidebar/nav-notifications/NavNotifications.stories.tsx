import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavNotifications } from "./NavNotifications";

const meta: Meta<typeof NavNotifications> = {
  title: "UI Molecules/Sidebar/NavNotifications",
  component: NavNotifications,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="mx-auto pt-12">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof NavNotifications>;

export const Default: Story = {
  args: {
    namespace: "blocks.sidebar-02",
    notifications: [
      { id: "1", avatar: "/avatars/01.png", fallback: "OM" },
      { id: "2", avatar: "/avatars/02.png", fallback: "JL" },
      { id: "3", avatar: "/avatars/03.png", fallback: "HH" },
    ],
  },
};
