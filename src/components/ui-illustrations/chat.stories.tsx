import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Chat } from "./chat";

const meta: Meta<typeof Chat> = {
  title: "UI Illustrations/Chat",
  component: Chat,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Chat>;

export const Default: Story = {};
