import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Message2Illustration } from "./message-2";

const meta: Meta<typeof Message2Illustration> = {
  title: "UI Illustrations/Message 2",
  component: Message2Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Message2Illustration>;
export const Default: Story = {};
