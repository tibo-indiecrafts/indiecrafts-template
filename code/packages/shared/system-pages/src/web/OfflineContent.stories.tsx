import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OfflineContent } from "./OfflineContent";

const meta = {
  title: "System Pages/OfflineContent",
  component: OfflineContent,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    title: "You're offline",
    description: "Check your connection and try again.",
    retryLabel: "Try again",
  },
} satisfies Meta<typeof OfflineContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
