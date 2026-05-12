import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChatBubblesIllustration } from "./chat-bubbles-illustration";

const meta: Meta<typeof ChatBubblesIllustration> = {
  title: "UI Illustrations/ChatBubbles",
  component: ChatBubblesIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ChatBubblesIllustration>;

export const Default: Story = {};
